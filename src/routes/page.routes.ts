import express, { type Request, type Response } from "express";
import { URL } from "../models/url.model.js";
import { restrictToRole } from "../middlewares/role.middleware.js";

export const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    if (!req.user) return res.render("landing");
    return res.redirect("/url");
  })
  .post((req, res) => {
    return res.redirect("/user/login");
  });

router
    .get(
        "/admin",
        restrictToRole(["ADMIN"]),
        async (req: Request, res: Response) => {

            const allUrls = await URL
                .find({})
                .populate("createdBy")
                .sort({ createdAt: -1 });

            let totalClicks = 0;
            let mostClicks = 0;

            allUrls.forEach((url) => {
                totalClicks += url.clicks;
                mostClicks = Math.max(
                    mostClicks,
                    url.clicks
                );
            });

            return res.render("admin", {
                name: req.user!.fullName.split(" ")[0],
                urls: allUrls,
                totalUrls: allUrls.length,
                totalClicks,
                mostClicks,
                message:
                    req.query.error === "invalid-url"
                        ? "Invalid URL"
                        : null
            });
        }
    );