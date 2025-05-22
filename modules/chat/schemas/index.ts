import { z } from "zod";

const chatSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

const conversationschema = z.object({
  participantId: z.string(),
});

export { chatSchema, conversationschema };
