import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/token.service.js"; 
import { USER } from "../models/user.model.js";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.cookies;
    req.user = null;

    if (!token) return next();

    const userId = verifyToken(token);

    if (!userId) return next();

    const user = await USER.findById(userId);

    if (!user) return next();

    if(!user.isVerified) return next();

    req.user = user;
    return next();
  } catch (err) {
    throw new Error(`Something went wrong: ${err}`)
  }
}
