import { z } from "zod";
import { customMessages } from "../utils";
const registerSchema = z.object({
  email: z.string().email(customMessages.string.email),
  password: z
    .string()
    .min(8, customMessages.string.min(8))
    .max(128, "Password must be at most 128 characters long."),
  userName: z.string().min(5),
});

const loginSchema = z.object({
  email: z.string().email(customMessages.string.email),
  password: z
    .string()
    .min(8, customMessages.string.min(8))
    .max(128, "Password must be at most 128 characters long."),
});

const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters long"),
});

const validateSchema = z.object({
  email: z.string().email(customMessages.string.email),
  otp: z.string().min(6, customMessages.string.min(6)),
});
export {
  loginSchema,
  registerSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  validateSchema,
};
