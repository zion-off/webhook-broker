import { Request, Response, NextFunction } from "express";

import { loginUser, registerUser } from "@/services/auth-services";
import { signToken } from "@/utils";
import { HttpError } from "@/utils";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new HttpError("Username or password missing", 400);
    }

    await registerUser(username, password);
    const token = signToken(username);

    res.status(200).json({
      Message: `Registered and logged in user ${username}`,
      Token: token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new HttpError("Username or password missing", 400);
    }

    await loginUser(username, password);
    const token = signToken(username);

    res.status(200).json({
      Message: `Logged in user ${username}`,
      Token: token,
    });
  } catch (error) {
    next(error);
  }
};
