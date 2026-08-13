import express from "express";
import { handleCreateShortUrl, handleGetUserUrls, handleRedirectUrl } from "../controllers/url.controller.js";
import { restrictToRole } from "../middlewares/role.middleware.js";


export const urlRouter = express.Router();

urlRouter.route("/")
    .get(restrictToRole(["USER", "ADMIN"]), handleGetUserUrls)
    .post(restrictToRole(["USER", "ADMIN"]), handleCreateShortUrl)

urlRouter.route("/:shortId")
    .get(handleRedirectUrl)