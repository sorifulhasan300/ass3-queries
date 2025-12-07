import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
export const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }
      const decode = jwt.verify(
        token as string,
        config.secrete as string
      ) as JwtPayload;
      req.user = decode as JwtPayload;

      if (roles.length && !roles.includes(decode.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed to access this route",
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }
  };
};
