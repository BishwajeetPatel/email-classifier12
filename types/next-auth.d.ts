import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extending the built-in session type to include accessToken and refreshToken
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extending the built-in JWT type to include accessToken and refreshToken
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}