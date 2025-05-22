import http from "@/lib/ky";
import { HTTPError } from "ky";
import { TypingSchema } from "../types";

export type Typing = {
  _id: string;
  conversationId: string;
  userId: string;
  __v: number;
  lastTypedAt: string;
};

type Typingresponse = {
  typeStatus: Typing;
  status: string;
};

async function parseErrorResponse(
  error: HTTPError,
  message?: string
): Promise<string> {
  try {
    const body: { message?: string } = await error.response.json();
    return body.message || `${message}`;
  } catch {
    return `Failed to fetch ${message}`;
  }
}

export async function sendTypingSignal(data: TypingSchema) {
  try {
    const response = await http
      .post("typing", { json: data })
      .json<Typingresponse>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorBody = await error.response.json();
      const errorMessage = errorBody?.error || "An unexpected error occurred";
      throw new Error(errorMessage);
    }

    throw new Error("An unknown error occurred while requesting the typing.");
  }
}

export async function typingSignal(conversationId: string) {
  try {
    const response = await http
      .get(`typing/${conversationId}`)
      .json<{ typingUser: string | null }>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError)
      throw new Error(await parseErrorResponse(error));
    throw new Error(
      "An unexpected error occurred while fetching typing signal."
    );
  }
}
