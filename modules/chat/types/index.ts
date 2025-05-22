import { z } from "zod";
import { chatSchema, conversationschema } from "../schemas";

type ChatSchema = z.infer<typeof chatSchema>;
type Conversationschema = z.infer<typeof conversationschema>;

export type { ChatSchema, Conversationschema };
