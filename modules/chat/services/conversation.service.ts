import http from "@/lib/ky";
import { Conversationschema } from "../types";
import { HTTPError } from "ky";

type ConversationResponse = {
  message: string;
  conversation: {
    _id: string;
    participants: string[];
    readStatus: {
      userId: string;
      _id: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
};

type PopulatedUser = {
  _id: string;
  userName: string;
};

type ReadStatus = {
  userId: string;
  _id: string;
};

type Conversation = {
  _id: string;
  participants: PopulatedUser[]; // 👈 Populated now
  readStatus: ReadStatus[];
  createdAt: string;
  updatedAt: string;
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

async function startConversation(data: Conversationschema) {
  try {
    const response = await http
      .post("conversations", { json: data })
      .json<ConversationResponse>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorBody = await error.response.json();
      const errorMessage = errorBody?.error || "An unexpected error occurred";
      throw new Error(errorMessage);
    }

    throw new Error(
      "An unknown error occurred while requesting the conversation."
    );
  }
}

async function myConversations(): Promise<Conversation[]> {
  try {
    const response = await http
      .get("conversations/me")
      .json<{ conversations: Conversation[] }>();
    return response.conversations;
  } catch (error) {
    if (error instanceof HTTPError)
      throw new Error(await parseErrorResponse(error));
    throw new Error(
      "An unexpected error occurred while fetching conversations."
    );
  }
}

export { startConversation, myConversations };
