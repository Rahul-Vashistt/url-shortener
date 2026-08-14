import express from "express";
import { handleForgotPassword, handleLogin, handleResendVerification, handleResetPassword, handleResetPasswordPage, handleSignUp, handleVerifyEmail } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.route("/login")
    .get((req, res) => {
        return res.render("login");
    })
    .post(handleLogin)

authRouter.route("/signup")
    .get((req, res) => {
        return res.render("signup");
    })
    .post(handleSignUp);

authRouter.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.redirect("/user/login");
})

authRouter
    .route("/verify-email")
    .get(handleVerifyEmail)

authRouter
    .route("/resend-verification")
    .post(handleResendVerification)

authRouter
    .route("/forgot-password")
    .get((req, res) => {
        return res.render("forgotPassword");
    })
    .post(handleForgotPassword);

authRouter
    .route("/reset-password")
    .get(handleResetPasswordPage)
    .post(handleResetPassword)