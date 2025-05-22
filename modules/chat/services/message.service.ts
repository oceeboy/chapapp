import http from "@/lib/ky";
import { HTTPError } from "ky";

type MessageType = {
  _id: string;
  conversationId: string;
  senderId: {
    _id: string;
    userName: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Sender = {
  _id: string;
  userName: string;
};

type MessageMainType = {
  _id: string;
  conversationId: string;
  senderId: Sender;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ReadStatus = {
  userId: string;
  _id: string;
  lastReadMessageId?: string | null; // If you're extending to include this later
};

export type ConversationType = {
  _id: string;
  participants: string[];
  readStatus: ReadStatus[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type MessageResponse = {
  messages: MessageMainType[];
  conversation: ConversationType;
  currentUserId: string;
};

async function parseErrorResponse(
  error: HTTPError,
  action: string
): Promise<string> {
  try {
    const body: { message?: string } = await error.response.json();
    return body.message || `${action} failed (status ${error.response.status})`;
  } catch {
    return `${action} failed (unexpected response format)`;
  }
}

async function messages(): Promise<MessageType[]> {
  try {
    const response = await http.get("messages").json<MessageType[]>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const message = await parseErrorResponse(error, "Fetching messages");
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred while fetching messages.");
  }
}

async function messageConversation(
  conversationId: string
): Promise<MessageResponse> {
  try {
    const response = await http
      .get(`messages/${conversationId}`)
      .json<MessageResponse>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const msg = await parseErrorResponse(
        error,
        `Fetching message ${conversationId}`
      );
      throw new Error(msg);
    }
    throw new Error(
      `An unexpected error occurred while fetching message ${conversationId}.`
    );
  }
}

export { messages, messageConversation };
