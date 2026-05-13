import { JwtPayload } from "jsonwebtoken";
import { TokenPayload } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload 
    }
  }
}