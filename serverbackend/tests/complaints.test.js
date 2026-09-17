import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import router from "../src/routes/user/landowner.routes.js";
import { landowner } from "../src/models/users/landowner.js";
import { authority } from "../src/models/users/authority.js";
import { landRecord } from "../src/models/record/landrecord.js";
import { Complaint } from "../src/models/complaints.js";

test("landowner complaint routes and session renewal", async (t) => {
    process.env.ACCESS_TOKEN_SECRET = "complaint-test-access-secret";
    process.env.REFRESH_TOKEN_SECRET = "complaint-test-refresh-secret";
    process.env.ACCESS_TOKEN_EXPIRY = "15m";
    process.env.REFRESH_TOKEN_EXPIRY = "1d";
    process.env.NODE_ENV = "test";
    const account = new landowner({ _id: "507f1f77bcf86cd799439011", userName: "test-owner" });
    const accessToken = account.generateAccessToken();
    const records = [];
    let land = null;
    let matchingAuthority = null;
    let failLookup = false;
    let failSave = false;
    let tokenSaved = false;
    t.mock.method(landowner, "findById", () => ({
        select: async () => {
            if (failLookup) throw new Error("Database unavailable");
            return account;
        },
        then: (resolve, reject) => Promise.resolve(account).then(resolve, reject),
    }));
    t.mock.method(account, "save", async () => {
        await Promise.resolve();
        tokenSaved = true;
        return account;
    });
    t.mock.method(landRecord, "findOne", (filter) => {
        assert.equal(String(filter.landowner), String(account._id));
        return { sort: () => ({ select: async () => land }) };
    });
    t.mock.method(authority, "findOne", () => ({ select: async () => matchingAuthority }));
    t.mock.method(Complaint, "create", async (data) => {
        const record = new Complaint(data);
        await record.validate();
        if (failSave) throw new Error("Database write failed");
        records.push(record.toObject());
        return record;
    });
    t.mock.method(Complaint, "aggregate", async ([{ $match: filter }]) => {
        assert.equal(filter.ComplaintFromModel, "landowner");
        return records.filter(record => String(record.complaintfrom) === String(filter.complaintfrom));
    });

    const app = express();
    app.use(express.json(), cookieParser());
    app.use("/landowner", router);
    app.use((error, req, res, next) => res.status(error.statusCode || (error.name === "ValidationError" ? 400 : 500))
        .json({ message: error.message }));
    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const base = `http://127.0.0.1:${server.address().port}/landowner`;
    async function request(path, { method = "GET", body, cookie = `accessToken=${accessToken}`, headers = {} } = {}) {
        const response = await fetch(base + path, {
            method,
            headers: { "Content-Type": "application/json", Cookie: cookie, ...headers },
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
            signal: AbortSignal.timeout(5000),
        });
        return { response, data: await response.json() };
    }
    const validBody = { category: "Payment Issues", message: " Payment is delayed " };

    await t.test("valid cookies and bearer tokens fetch only the owner's complaints", async () => {
        const first = await request("/get-complaints");
        assert.equal(first.response.status, 200);
        assert.deepEqual(first.data.data.ComplaintData, []);
        const bearer = await request("/get-complaints", { cookie: "accessToken=stale", headers: { Authorization: `Bearer ${accessToken}` } });
        assert.equal(bearer.response.status, 200);
    });

    await t.test("missing, invalid, and expired tokens remain unauthorized", async () => {
        for (const cookie of ["", "accessToken=invalid", `accessToken=${jwt.sign({ _id: String(account._id) }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: -1 })}`]) {
            assert.equal((await request("/get-complaints", { cookie })).response.status, 401);
        }
        failLookup = true;
        const result = await request("/get-complaints");
        assert.equal(result.response.status, 500);
        assert.equal(result.data.message, "Database unavailable");
        failLookup = false;
    });

    await t.test("submission persists a generated ID, authenticated owner, and pending status", async () => {
        const { response, data } = await request("/post-complaints", { method: "POST", body: { ...validBody, complaintfrom: "spoof", status: "Resolved" } });
        assert.equal(response.status, 201);
        assert.match(data.data.complaint._id, /^[a-f0-9]{24}$/);
        assert.equal(data.data.complaint.message, "Payment is delayed");
        assert.equal(data.data.complaint.complaintfrom, String(account._id));
        assert.equal(data.data.complaint.status, "Pending");
        assert.ok(data.data.complaint.Date);
        assert.equal(data.data.complaint.complaintto, undefined);
        const result = await request("/get-complaints");
        assert.equal(result.data.data.ComplaintData.length, 1);
        assert.equal(new Complaint({ ...records[0], _id: 123 })._id, 123);
    });

    await t.test("authority assignment uses the land record or matching working zone", async () => {
        land = { authorityAssigned: "507f1f77bcf86cd799439012" };
        let result = await request("/post-complaints", { method: "POST", body: validBody });
        assert.equal(result.data.data.complaint.complaintto, land.authorityAssigned);
        land = { landCity: "Pune" };
        matchingAuthority = { _id: "507f1f77bcf86cd799439013" };
        result = await request("/post-complaints", { method: "POST", body: validBody });
        assert.equal(result.data.data.complaint.complaintto, matchingAuthority._id);
    });

    await t.test("validation and database failures do not report a successful save", async () => {
        const count = records.length;
        for (const body of [{}, { ...validBody, message: " " }, { ...validBody, category: "invalid" }, { ...validBody, message: "x".repeat(1001) }]) {
            assert.equal((await request("/post-complaints", { method: "POST", body })).response.status, 400);
        }
        failSave = true;
        assert.equal((await request("/post-complaints", { method: "POST", body: validBody })).response.status, 500);
        failSave = false;
        assert.equal(records.length, count);
    });

    await t.test("refresh persists and returns the correctly named cookies", async () => {
        const oldRefresh = jwt.sign({ _id: String(account._id) }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d", jwtid: "old" });
        account.refreshToken = oldRefresh;
        const result = await request("/refresh-access-token", { method: "POST", cookie: `refreshToken=${oldRefresh}` });
        assert.equal(result.response.status, 200);
        assert.equal(tokenSaved, true);
        assert.equal(result.data.data.refreshToken, account.refreshToken);
        const cookies = result.response.headers.getSetCookie();
        assert.ok(cookies.some(cookie => cookie.startsWith("accessToken=") && cookie.includes("HttpOnly")));
        assert.ok(cookies.some(cookie => cookie.startsWith("refreshToken=")));
        assert.ok(cookies.every(cookie => !cookie.includes("Secure") && !cookie.startsWith("newrefreshToken=")));
        const renewed = await request("/get-complaints", { cookie: `accessToken=${result.data.data.accessToken}` });
        assert.equal(renewed.response.status, 200);
        assert.equal((await request("/refresh-access-token", { method: "POST", cookie: `refreshToken=${oldRefresh}` })).response.status, 401);
        assert.equal((await request("/refresh-access-token", { method: "POST", cookie: "" })).response.status, 401);
    });
});
