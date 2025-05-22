// import {
//   loginUserSchema,
//   verifyUserSession,
//   generateOtpSchema,
//   forgetPasswordSchema,
//   resetPasswordSchema,
// } from "@/schemas/auth.schema";
import { LoginSchema, loginSchema, RegisterSchema } from "@/modules/auth";
import http from "../ky";
import { HTTPError } from "ky";

// === Types ===

interface BaseUser {
  id: string;
  email: string;
  role: "user" | "admin";
  userName: string;
}

interface LoginSuccess {
  success: true;
  message: string;
  user: BaseUser;
}

interface LoginFailure {
  success: false;
  message: string;
}

type LoginResponse = LoginSuccess | LoginFailure;

interface RegisterSuccess {
  success: true;
  message: string;
  user: BaseUser;
}

interface RegisterFailure {
  success: false;
  message: string;
}

type RegisterResponse = RegisterSuccess | RegisterFailure;

// === Hook ===
export function useAuthentication() {
  // === Login ===
  async function login(data: LoginSchema): Promise<LoginResponse> {
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
    }

    try {
      const result = await http.post("auth/login", {
        json: data,
        timeout: 30000,
      });
      const response: { message: string; user: BaseUser } = await result.json();

      return {
        success: true,
        message: response.message,
        user: response.user,
      };
    } catch (error) {
      const isUnauthorized =
        error instanceof HTTPError && error.response?.status === 401;

      return {
        success: false,
        message: isUnauthorized
          ? "Invalid email or password"
          : "An error occurred while logging in",
      };
    }
  }

  // === Register ===
  async function register(data: RegisterSchema): Promise<RegisterResponse> {
    try {
      const result = await http.post("auth/register", {
        json: data,
        timeout: 30000,
      });

      const response: { message: string; user: BaseUser } = await result.json();

      return {
        success: true,
        message: response.message,
        user: response.user,
      };
    } catch (error: unknown) {
      const isHTTPError = error instanceof HTTPError;
      const status = isHTTPError ? error.response?.status : null;
      let message = "Failed to register";

      if (isHTTPError) {
        try {
          const errorJson = await error.response?.json();
          if (errorJson?.error) {
            message = errorJson.error;
          }
        } catch {
          // fallback if error JSON can't be parsed
          message = error.response?.statusText || message;
        }

        if (status === 409) {
          message = "User already exists";
        }
      }

      return {
        success: false,
        message,
      };
    }
  }
  async function logout() {
    try {
      const result = await http.post("auth/logout");

      const response: { message: string } = await result.json();
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      const errorMessage =
        error instanceof HTTPError && error.response?.status === 500;
      return {
        success: true,
        message: errorMessage ? "Network Issue" : "Error Logging Out",
      };
    }
  }

  return {
    login,

    register,
    logout,
  };
}
