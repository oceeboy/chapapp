import http from "@/lib/ky";
import { HTTPError } from "ky";

type UserType = {
  _id: string;
  userName: string;
  email: string;
  role: "user" | "admin";
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
};

type UsersResponse = {
  users: UserType[];
  total: number;
  page: number;
  totalPages: number;
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

async function users(
  search = "",
  page = 1,
  limit = 10
): Promise<UsersResponse> {
  try {
    const response = await http
      .get(`user?q=${search}&page=${page}&limit=${limit}`)
      .json<UsersResponse>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const message = await parseErrorResponse(error, "Fetching users");
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred while fetching users.");
  }
}

async function me(): Promise<UserType> {
  try {
    const response = await http
      .get(`user/me`)
      .json<{ message: string; user: UserType }>();
    return response.user;
  } catch (error) {
    if (error instanceof HTTPError) {
      const message = await parseErrorResponse(error, "Fetching details");
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred while fetching details.");
  }
}

export { users, me };
