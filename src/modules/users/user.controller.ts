import { Request, Response } from "express";
import { userService } from "./user.service";
import { Service } from "../auth/auth.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({
      success: true,
      message: "User get Successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User get Unsuccessfully",
      error: (error as Error).message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const { name, email, phone, role } = req.body;
  try {
    const result = await userService.updateUser(
      id as string,
      name,
      email,
      phone,
      role
    );
    if (result.rowCount === 0) {
      res.status(400).json({
        success: true,
        message: "User Not Found",
        data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
      message: "User update Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User update Unsuccessfully",
      error: (error as Error).message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const users = await userService.deleteUser(id as string);
    if (users.rowCount === 0) {
      res.status(400).json({
        success: true,
        message: "User Not Found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "User Delete Successfully",
      data: users.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User Delete Unsuccessfully",
      error: (error as Error).message,
    });
  }
};

export const usersController = {
  getUsers,
  updateUser,
  deleteUser,
};
