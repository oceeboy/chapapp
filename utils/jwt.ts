/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const AUTH_VERSION = process.env.AUTH_VERSION as string;

export type TokenPayload = {
  userId: string;
  role: string;
  version?: string;
  exp?: number;
  iat?: number;
};

type AccessTokenInput = Omit<TokenPayload, "version" | "exp" | "iat">;
type RefreshTokenInput = Pick<TokenPayload, "userId">;

function cleanPayload<T extends Partial<TokenPayload>>(
  payload: T
): Omit<T, "exp" | "iat"> {
  const { exp, iat, ...rest } = payload;
  return rest;
}

export function signAccessToken(payload: AccessTokenInput): string {
  const base = cleanPayload(payload);
  const tokenPayload: TokenPayload = {
    ...base,
    version: AUTH_VERSION,
  };
  return jwt.sign(tokenPayload, ACCESS_SECRET, { expiresIn: "2d" });
}

export function signRefreshToken(payload: RefreshTokenInput): string {
  const tokenPayload = cleanPayload(payload);
  return jwt.sign(tokenPayload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}
