import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { USER } from "../models/user.model.js";
import { createToken } from "../services/token.service.js";
import { generateToken, hashToken } from "../utils/token.js";
import { sendVerificationEmail } from "../services/email.service.js";

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
    return LoggedIn ? true : false;
  } catch (err) {
    console.log("Failed to check user login");
    throw new Error("Failed to verify user");
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

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!password) {
    return res.render("login", {
      message: "Password cannot be blank",
    });
  }

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

  if (!user.isVerified) {
    return res.render("login", {
      status: "unverified",
      email: user.email,
    });
  }

  const token = createToken(user);

  if (!token) {
    return res.render("login", {
      message: "Something went wrong. Please try again",
    });
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.redirect("/url");
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

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);
  const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await USER.create({
    fullName,
    username,
    email,
    password: hashedPassword,
    verificationToken: hashedToken,
    verificationTokenExpiry,
  });

  const verificationEmail = `${process.env.BASE_URL}/user/verify-email?token=${rawToken}`;

  await sendVerificationEmail(email, verificationEmail);

  res.status(201).redirect(`/user/verify-email`);
}

export async function handleVerifyEmail(req: Request, res: Response) {
  const { token } = req.query;

  if (!token) {
    return res.render("verification", {
      status: "pending",
    });
  }

  if (typeof token !== "string") {
    return res.status(400).render("verification", {
      status: "invalid",
    });
  }

  const hashedRawToken = hashToken(token);

  const user = await USER.findOne({
    verificationToken: hashedRawToken,
  });

  if (!user) {
    return res.status(400).render("verification", {
      status: "expired",
    });
  }

  if (
    !user.verificationTokenExpiry ||
    user.verificationTokenExpiry.getTime() < Date.now()
  ) {
    return res.status(400).render("verification", {
      status: "expired",
      email: user.email,
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;

  await user.save();

  return res.render("verification", {
    status: "verified",
    email: user.email,
  });
}

export async function handleResendVerification(req: Request, res: Response) {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).render("verification", {
      status: "invalid",
    });
  }

  const user = await USER.findOne({ email });

  if (!user) {
    return res.status(404).render("verification", {
      status: "invalid",
    });
  }

  if (user.isVerified) {
    return res.render("verification", {
      status: "verified",
      email: user.email,
    });
  }

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  user.verificationToken = hashedToken;
  user.verificationTokenExpiry = verificationTokenExpiry;

  await user.save();

  const verificationEmail = `${process.env.BASE_URL}/user/verify-email?token=${rawToken}`;

  await sendVerificationEmail(user.email, verificationEmail);

  return res.render("verification", {
    status: "pending",
    email: user.email,
  });
}

export async function handleForgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  const user = await USER.findOne({ email });

  if (user) {
    const rawToken = generateToken();
    const hashedToken = hashToken(rawToken);

    const passwordResetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiry = passwordResetTokenExpiry;

    await user.save();

    const passwordResetEmail = `${process.env.BASE_URL}/user/reset-password?token=${rawToken}`;

    await sendVerificationEmail(user.email, passwordResetEmail);

    return res.render("forgotPassword", {
      status: "pending",
      email,
    });
  }

  return res.render("forgotPassword", {
    status: "pending",
    email,
  });
}

export async function handleResetPasswordPage(req: Request, res: Response) {
  const { token } = req.query;

  if (!token) {
    return res.redirect("/user/forgot-password");
  }

  if (typeof token !== "string") {
    return res.status(400).render("resetPassword", {
      status: "invalid",
    });
  }

  const hashedRawToken = hashToken(token);

  const user = await USER.findOne({ passwordResetToken: hashedRawToken });

  if (!user) {
    return res.status(400).render("resetPassword", {
      status: "invalid",
    });
  }

  if (
    !user.passwordResetTokenExpiry ||
    user.passwordResetTokenExpiry.getTime() < Date.now()
  ) {
    return res.status(400).render("resetPassword", {
      status: "invalid",
    });
  }

  return res.render("resetPassword", {
    token,
  });
}

export async function handleResetPassword(req: Request, res: Response) {
  const { token, password, confirmPassword } = req.body;

  if (!token || typeof token !== "string") {
    return res.redirect("/user/forgot-password");
  }

  if (!password || !confirmPassword) {
    return res.render("resetPassword", {
      status: "invalid",
    });
  }

  if (password !== confirmPassword) {
    return res.render("resetPassword", {
      message: "Passwords do not match. Please try again.",
      token,
    });
  }

  const hashedRawToken = hashToken(token);

  const user = await USER.findOne({
    passwordResetToken: hashedRawToken,
  });

  if (!user) {
    return res.status(400).render("resetPassword", {
      status: "invalid",
    });
  }

  if (
    !user.passwordResetTokenExpiry ||
    user.passwordResetTokenExpiry.getTime() < Date.now()
  ) {
    return res.status(400).render("resetPassword", {
      status: "invalid",
    });
  }

  const hashedPassword = await encryptPassword(password, 10);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;

  await user.save();

  return res.render("resetPassword", {
    status: "success",
  });
}
