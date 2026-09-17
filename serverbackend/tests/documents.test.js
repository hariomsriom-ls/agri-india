import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { access } from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";
import workerRouter from "../src/routes/user/worker.routes.js";
import landownerRouter from "../src/routes/user/landowner.routes.js";
import { worker } from "../src/models/users/workers.js";
import { landowner } from "../src/models/users/landowner.js";
import { Documents } from "../src/models/document.js";

test("worker documents use authenticated ownership and shared controller", async (t) => {
    process.env.ACCESS_TOKEN_SECRET = "document-route-test-secret";
    const workerId = "WORKER-001";
    const ownerId = new mongoose.Types.ObjectId();
    let filter;
    let saved;
    let failSave = false;
    let rollbackCount = 0;
    const paths = [];
    t.mock.method(worker, "findById", (id) => ({ select: async () => id === workerId ? { _id: workerId, role: "worker" } : null }));
    t.mock.method(landowner, "findById", (id) => ({ select: async () => id === String(ownerId) ? { _id: ownerId, role: "landowner" } : null }));
    t.mock.method(Documents, "find", (query) => ({ sort: async (sort) => {
        filter = query;
        assert.deepEqual(sort, { createdAt: -1 });
        return saved && String(saved.documentOf) === String(query.documentOf) ? [saved] : [];
    } }));
    t.mock.method(Documents, "create", async (data) => {
        const document = new Documents(data);
        await document.validate();
        if (failSave) throw new Error("Database unavailable");
        saved = document.toObject();
        return document;
    });
    t.mock.method(cloudinary.uploader, "upload", async (path) => {
        paths.push(path);
        return { secure_url: "https://example.test/document.pdf", public_id: "document-test", resource_type: "image", format: "pdf" };
    });
    t.mock.method(cloudinary.uploader, "destroy", async () => { rollbackCount++; return { result: "ok" }; });
    const app = express();
    app.use("/worker", workerRouter);
    app.use("/landowner", landownerRouter);
    app.use((error, req, res, next) => res.status(error.statusCode || 500).json({ message: error.message }));
    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const headers = { Authorization: `Bearer ${jwt.sign({ _id: workerId }, process.env.ACCESS_TOKEN_SECRET)}` };
    t.after(async () => {
        await new Promise(resolve => server.close(resolve));
        for (const path of paths) await assert.rejects(access(path), { code: "ENOENT" });
    });
    function upload(type = "application/pdf") {
        const body = new FormData();
        body.append("name", " Identity proof ");
        body.append("category", "Identity");
        body.append("documentOf", "other-worker");
        body.append("documentOfModel", "landowner");
        body.append("document", new Blob(["test file"], { type }), "proof.pdf");
        return fetch(base + "/worker/upload-document", { method: "POST", headers, body });
    }

    await t.test("fetch is authenticated and scoped to the worker string ID", async () => {
        assert.equal((await fetch(base + "/worker/get-documents")).status, 401);
        const response = await fetch(base + "/worker/get-documents", { headers });
        assert.equal(response.status, 200);
        assert.deepEqual((await response.json()).data.Documents, []);
        assert.deepEqual(filter, { documentOf: workerId, documentOfModel: "worker" });
    });
    await t.test("upload persists worker ownership and can be fetched", async () => {
        const response = await upload();
        assert.equal(response.status, 201);
        const { document } = (await response.json()).data;
        assert.equal(document.name, "Identity proof");
        assert.equal(document.documentOf, workerId);
        assert.equal(document.documentFrom, workerId);
        assert.equal(document.documentOfModel, "worker");
        assert.equal(document.format, "pdf");
        const fetched = await fetch(base + "/worker/get-documents", { headers });
        assert.equal((await fetched.json()).data.Documents[0]._id, document._id);
    });
    await t.test("landowner fetch retains its role and ObjectId filter", async () => {
        assert.equal((await fetch(base + "/landowner/get-documents", { headers })).status, 401);
        const response = await fetch(base + "/landowner/get-documents", {
            headers: { Authorization: `Bearer ${jwt.sign({ _id: String(ownerId) }, process.env.ACCESS_TOKEN_SECRET)}` },
        });
        assert.equal(response.status, 200);
        assert.equal((await response.json()).data.Documents.length, 0);
        assert.equal(filter.documentOfModel, "landowner");
        assert.ok(filter.documentOf instanceof mongoose.Types.ObjectId);
    });
    await t.test("invalid files and database errors are reported", async () => {
        assert.equal((await upload("text/plain")).status, 400);
        failSave = true;
        assert.equal((await upload()).status, 500);
        assert.equal(rollbackCount, 1);
    });
});
