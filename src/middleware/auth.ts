import { NextFunction, Request, Response } from "express";

export const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
  };
};
