import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import connectDB from "../src/db/index.js";
import AllowedAuthority from "../src/models/record/allowedauthoritesrecord.js";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});


const authorities = Array.from({ length: 200 }, (_, index) => {
  const number = index + 1;

  return {
    authorityId: `AUTH${String(number).padStart(3, "0")}`,
    email: `authority${number}@example.com`,
    phoneNumber: String(9000000000 + number),
  };
});

 

const seedAllowedAuthorities = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from serverbackend/.env");
    }

    await connectDB();
    await AllowedAuthority.init();

    for (const authority of authorities) {
      const record = {
        authorityId: authority.authorityId.trim(),
        email: authority.email.trim().toLowerCase(),
        phoneNumber: authority.phoneNumber.trim(),
      };

      await AllowedAuthority.updateOne(
        { authorityId: record.authorityId },
        { $set: record },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Allowed authorities seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAllowedAuthorities();