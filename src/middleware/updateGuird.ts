import { NextFunction, Request, Response } from "express";

export const updateUserGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const targetId = req.params.userId;
  const user = req.user;
  if (user?.role === "customer") {
    if (user.id != targetId) {
      return res.status(403).json({
        message: "Customers can update only their own profile",
      });
    }
    if (req.body.role) {
      return res.status(403).json({
        message: "You are not allowed to change role",
      });
    }
  }
  next();
};
