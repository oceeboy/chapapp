import http from "@/lib/ky";
import { ChatSchema } from "../types";
import { HTTPError } from "ky";

type Chatesponse = {
  message: string;
};

async function createChat(data: ChatSchema) {
  try {
    const response = await http
      .post("chat", { json: data })
      .json<Chatesponse>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorBody = await error.response.json();
      const errorMessage = errorBody?.error || "An unexpected error occurred";
      throw new Error(errorMessage);
    }

    // Fallback for non-HTTPError types (ensures function always throws or returns)
    throw new Error("An unknown error occurred while creating a chat.");
  }
}

export { createChat };
