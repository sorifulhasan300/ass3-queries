import { Request, Response } from "express";
import { pool } from "../../config/database";
import { Service } from "./auth.service";
import bcrypt from "bcryptjs";

const signUp = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
 
  try {
    const result = await Service.signUp(name, email, password, phone, role);
  
    if (result.rowCount === 0) {
      res.status(400).json({
        success: false,
        message: "Signup Field",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "signup successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "signup unsuccessfully",
      error: (error as Error).message,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await Service.signIn(email, password);
    res.status(200).json({
      success: true,
      message: "Sign In Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Sign In unsuccessfully",
      error: (error as Error).message,
    });
  }
};

export const Controller = { signUp, signIn };
