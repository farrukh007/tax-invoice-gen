import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload | string;
}

export function verifyToken(handler: (req: AuthenticatedRequest, res: NextApiResponse) =>any) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
      const secret = "SECRET_KEY"

      if (!secret) {
        return res.status(500).json({ message: "Server error: Missing JWT secret" });
      }

      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        req.user = decoded; // Attach decoded user info to request
        return handler(req, res);
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error: Token verification failed" });
    }
  };
}