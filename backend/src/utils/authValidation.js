const { z } = require("zod");

const stripUnsafeMarkup = (value) =>
  String(value)
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ");

const emailSchema = z
  .string({ required_error: "Email is required." })
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email is too long.")
  .email("Please enter a valid email address.")
  .transform((value) => value.toLowerCase());

const fullnameSchema = z
  .string({ required_error: "Full name is required." })
  .trim()
  .min(2, "Full name must be at least 2 characters.")
  .max(80, "Full name must be under 80 characters.")
  .refine((value) => !/[<>]/.test(value), "Full name contains invalid characters.")
  .transform(stripUnsafeMarkup);

const passwordSchema = z
  .string({ required_error: "Password is required." })
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password is too long.")
  .refine(
    (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(value),
    "Password must include uppercase, lowercase, a number, and a symbol."
  );

const registerSchema = z.object({
  fullname: fullnameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long.")
    .transform(stripUnsafeMarkup),
});

module.exports = {
  registerSchema,
  loginSchema,
  stripUnsafeMarkup,
};
