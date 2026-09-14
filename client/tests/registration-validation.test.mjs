import assert from "node:assert/strict";
import { test } from "node:test";
import {
  personalInfoSchema, workerPersonalInfoSchema, authorityPersonalInfoSchema,
  addressSchema, workerAddressSchema, bankSchema, workerImagesSchema,
} from "../src/validations/registration.ts";

const personal = {
  name: "Test User", email: "test@example.com", mobile: "9876543210",
  username: "test_user", password: "Example1!",
};
const address = {
  houseno: "12", landmark: "Market", country: "India", city: "Pune",
  district: "Pune", state: "Maharashtra", pincode: "411001",
};
const bank = { bankAccount: "001234567890", IfscCode: "SBIN0001234", Workingzone: "Pune" };
const validSteps = [
  ["landowner personal details", personalInfoSchema, personal],
  ["worker personal details", workerPersonalInfoSchema, { ...personal, dob: "2000-02-29" }],
  ["authority personal details", authorityPersonalInfoSchema, { ...personal, authorityid: "AUTH-1", department: "Agriculture" }],
  ["address", addressSchema, address],
  ["worker address", workerAddressSchema, { ...address, street: "Market Road" }],
  ["bank details", bankSchema, bank],
];

for (const [name, schema, values] of validSteps) {
  test(`${name}: accepts valid details and rejects every empty field`, () => {
    assert.equal(schema.safeParse(values).success, true);
    for (const key of Object.keys(values)) {
      for (const blank of ["", "   "]) {
        const result = schema.safeParse({ ...values, [key]: blank });
        assert.equal(result.success, false, `${key} must be required`);
        assert.match(result.error.issues.find((issue) => issue.path[0] === key).message, /required/);
      }
    }
  });
}

test("rejects malformed personal details and weak passwords", () => {
  for (const [field, value] of [
    ["name", "A"], ["email", "user@"], ["email", "user.example.com"],
    ["mobile", "1234567890"], ["mobile", "987654321"], ["mobile", "987654321a"],
    ["username", "abc"], ["username", "user name"],
    ["password", "Short1!"], ["password", "password1!"], ["password", "Password1"],
  ]) {
    assert.equal(personalInfoSchema.safeParse({ ...personal, [field]: value }).success, false, field);
  }
});

test("rejects invalid calendar dates and future dates of birth", () => {
  for (const dob of ["not-a-date", "2001-02-29", "2000-02-30", "2000-13-01", "2999-01-01"]) {
    assert.equal(workerPersonalInfoSchema.safeParse({ ...personal, dob }).success, false, dob);
  }
});

test("rejects invalid PIN codes, account numbers, and IFSC codes", () => {
  for (const pincode of ["000000", "41100", "4110011", "41100a"]) {
    assert.equal(addressSchema.safeParse({ ...address, pincode }).success, false);
  }
  for (const bankAccount of ["12345678", "1234567890123456789", "1234abc567"]) {
    assert.equal(bankSchema.safeParse({ ...bank, bankAccount }).success, false);
  }
  for (const IfscCode of ["SBIN1001234", "SBIN000123", "12340001234"]) {
    assert.equal(bankSchema.safeParse({ ...bank, IfscCode }).success, false);
  }
});

test("normalizes text and IFSC codes without altering passwords or account numbers", () => {
  const password = " Example1! ";
  const parsed = personalInfoSchema.parse({ ...personal, name: " Test User ", email: " test@example.com ", password });
  assert.equal(parsed.name, "Test User");
  assert.equal(parsed.email, "test@example.com");
  assert.equal(parsed.password, password);
  assert.deepEqual(bankSchema.parse({ ...bank, IfscCode: " sbin0001234 " }), bank);
});

test("requires both uploads and rejects invalid, empty, or oversized files", () => {
  const image = new File(["image"], "photo.png", { type: "image/png" });
  const governmentid = new File(["image"], "id.jpg", { type: "image/jpeg" });
  const valid = { image, governmentid };
  assert.equal(workerImagesSchema.safeParse(valid).success, true);
  const invalidFiles = [null, undefined, "photo.png", {},
    new File(["pdf"], "id.pdf", { type: "application/pdf" }),
    new File([], "empty.png", { type: "image/png" }),
    new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }),
  ];
  for (const field of ["image", "governmentid"]) {
    for (const file of invalidFiles) {
      const result = workerImagesSchema.safeParse({ ...valid, [field]: file });
      assert.equal(result.success, false, field);
      assert.equal(result.error.issues[0].path[0], field);
    }
  }
});
