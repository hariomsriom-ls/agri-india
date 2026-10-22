import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import router from "../src/routes/user/authority.routes.js";
import { authority } from "../src/models/users/authority.js";
import { project } from "../src/models/project.js";

test("authority projects require authentication and return only assigned projects", async (t) => {
    process.env.ACCESS_TOKEN_SECRET = "authority-project-test-secret";
    const account = new authority({ _id: "507f1f77bcf86cd799439011" });
    const records = [
        { _id: "assigned", projectAuthority: String(account._id), projectLocation: "Gwalior" },
        { _id: "other", projectAuthority: "507f1f77bcf86cd799439012", projectLocation: "Bhind" },
    ];
    let failQuery = false;
    let queryCount = 0;
    t.mock.method(authority, "findById", (id) => {
        assert.equal(String(id), String(account._id));
        return { select: async () => account };
    });
    t.mock.method(project, "aggregate", async ([{ $match: filter }]) => {
        queryCount += 1;
        assert.deepEqual(Object.keys(filter), ["projectAuthority"]);
        const ids = filter.projectAuthority.$in.map(String);
        assert.deepEqual(ids, [String(account._id)]);
        if (failQuery) throw new Error("Database unavailable");
        return records.filter((record) => ids.includes(record.projectAuthority));
    });

    const app = express();
    app.use(cookieParser());
    app.use("/api/v1/user/authority", router);
    app.use((error, req, res, next) => res.status(error.statusCode || 500).json({ message: error.message }));
    const server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const url = `http://127.0.0.1:${server.address().port}/api/v1/user/authority/get-projects`;
    const token = jwt.sign({ _id: String(account._id) }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
    const request = (cookie = `accessToken=${token}`) => fetch(url, {
        headers: { Cookie: cookie }, signal: AbortSignal.timeout(5000),
    });

    for (const cookie of ["", "accessToken=invalid"]) {
        assert.equal((await request(cookie)).status, 401);
    }
    assert.equal(queryCount, 0);

    const success = await request();
    assert.equal(success.status, 200);
    assert.deepEqual((await success.json()).data.ProjectData, [records[0]]);

    records.length = 0;
    const empty = await request();
    assert.equal(empty.status, 200);
    assert.deepEqual((await empty.json()).data.ProjectData, []);

    failQuery = true;
    const failed = await request();
    assert.equal(failed.status, 500);
    assert.equal((await failed.json()).message, "Database unavailable");
});
