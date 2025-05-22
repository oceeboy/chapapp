import { z } from "zod";
import { chatSchema, conversationschema, typingSchema } from "../schemas";

type ChatSchema = z.infer<typeof chatSchema>;
type Conversationschema = z.infer<typeof conversationschema>;

type TypingSchema = z.infer<typeof typingSchema>;
export type { ChatSchema, Conversationschema, TypingSchema };
