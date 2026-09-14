import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const personalInfoSchema = z.object({
  name: requiredText("Full name").min(2, "Full name must be at least 2 characters"),
  email: requiredText("Email").pipe(z.email("Enter a valid email address")),
  mobile: requiredText("Contact number").regex(
    /^[6-9]\d{9}$/,
    "Enter a valid 10-digit Indian mobile number",
  ),
  username: requiredText("Username")
    .min(4, "Username must be at least 4 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Use only letters, numbers, and underscores"),
  // Preserve the password exactly as entered, including any surrounding spaces.
  password: z.string()
    .refine((value) => value.trim().length > 0, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^A-Za-z0-9\s]/, "Password must contain a special character"),
});

export const workerPersonalInfoSchema = personalInfoSchema.extend({
  dob: requiredText("Date of birth")
    .pipe(z.iso.date("Enter a valid date of birth"))
    .refine((value) => new Date(`${value}T00:00:00`) <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
});

export const authorityPersonalInfoSchema = personalInfoSchema.extend({
  authorityid: requiredText("Authority ID"),
  department: requiredText("Department"),
});

export const addressSchema = z.object({
  houseno: requiredText("House / flat / road number"),
  landmark: requiredText("Landmark"),
  country: requiredText("Country"),
  city: requiredText("City"),
  district: requiredText("District"),
  state: requiredText("State"),
  pincode: requiredText("PIN code").regex(
    /^[1-9]\d{5}$/,
    "Enter a valid 6-digit PIN code",
  ),
});

export const workerAddressSchema = addressSchema.extend({
  street: requiredText("Street"),
});

export const bankSchema = z.object({
  bankAccount: requiredText("Bank account number").regex(
    /^\d{9,18}$/,
    "Bank account number must contain 9 to 18 digits",
  ),
  IfscCode: requiredText("IFSC code").toUpperCase().regex(
    /^[A-Z]{4}0[A-Z0-9]{6}$/,
    "Enter a valid 11-character IFSC code (e.g. SBIN0001234)",
  ),
  Workingzone: requiredText("Working zone"),
});

const imageFile = (label: string) => z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  `${label} is required`,
).refine(
  (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
  "Choose a JPG or PNG image",
).refine((file) => file.size > 0, "The selected file is empty")
  .refine((file) => file.size <= 10 * 1024 * 1024, "Image must be 10 MB or smaller");

export const workerImagesSchema = z.object({
  image: imageFile("Profile image"),
  governmentid: imageFile("Government ID image"),
});
