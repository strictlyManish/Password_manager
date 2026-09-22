import { z } from "zod";

const stripUnsafeMarkup = (value) =>
  String(value)
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ");

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long.")
    .transform(stripUnsafeMarkup),
});

export const registerSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must be under 80 characters.")
    .refine((value) => !/[<>]/.test(value), "Full name contains invalid characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long.")
    .refine(
      (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(value),
      "Password must include uppercase, lowercase, a number, and a symbol."
    ),
  confirmPassword: z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});
