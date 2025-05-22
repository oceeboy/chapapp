import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas";

type LoginSchema = z.infer<typeof loginSchema>;
type RegisterSchema = z.infer<typeof registerSchema>;

export type { LoginSchema, RegisterSchema };
