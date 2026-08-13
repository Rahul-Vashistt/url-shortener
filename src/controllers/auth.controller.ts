import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { USER } from "../models/user.model.js";
import { createToken } from "../services/auth.service.js";

async function encryptPassword(
  password: string,
  saltRounds: number,
): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.log("Hashing failed: ", err);
    throw new Error("Password encryption failed");
  }
}

async function isLoggedIn(email: string) {
    try {
        const LoggedIn = await USER.findOne({ email });
        return LoggedIn ? true: false
    } catch (err) {
        console.log("Failed to check user login")
        throw new Error("Failed to verify user")
    }
}

async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    return isPasswordCorrect;
  } catch (err) {
    console.log("Password compare failed: ", err);
    throw new Error("Password verification failed");
  }
}

export async function handleSignUp(req: Request, res: Response) {
  const { fullName, username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render("signup", {
      message: "Passwords do not match. Please try again.",
    });
  }

  const isUserLoggedIn = await isLoggedIn(email);

  if (isUserLoggedIn) {
    return res.render("signup", {
      message: "email is already registered. Please login!",
    });
  }

  const hashedPassword = await encryptPassword(password, 10);

  await USER.create({
    fullName,
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).redirect("/user/login");
}

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await USER.findOne({ email });

  if (!user) {
    return res.render("login", {
      message: "email is not registered. Please sign up",
    });
  }

  const isPasswordCorrect = await verifyPassword(password, user.password);

  if (!isPasswordCorrect) {
    return res.render("login", {
      message: "Password is incorrect",
    });
  }

  const token = createToken(user);

  if(!token) {
    return res.render("login", {
      message: "Something went wrong. Please try again"
    })
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })

  return res.redirect("/url");
}
