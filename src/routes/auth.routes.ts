import express from "express";
import { handleLogin, handleSignUp } from "../controllers/auth.controller.js";

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