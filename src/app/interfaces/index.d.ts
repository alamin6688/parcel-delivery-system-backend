import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      // The application stores the decoded JWT payload on req.user.
      // Use a JwtPayload base and extend with optional app-specific fields.
      user?: JwtPayload & {
        userId?: string;
        email?: string;
        role?: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}
