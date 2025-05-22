import { z } from "zod";

const authRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  userName: z.string().min(5),
});

const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export { authLoginSchema, authRegisterSchema };
