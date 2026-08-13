import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import { URL } from "../models/url.model.js";

function isValidUrl(value: string): boolean {
  try {
    const url = new globalThis.URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function handleCreateShortUrl(req: Request, res: Response) {
  const { originalUrl } = req.body;

  if (!originalUrl || !isValidUrl(originalUrl)) {
    return res.redirect("/url?error=invalid-url");
  }

  const shortId = nanoid(8);

  await URL.create({
    originalUrl,
    shortId,
    createdBy: req.user!._id,
  });

  return res.redirect(`/url?shortId=${shortId}`);
}

export async function handleRedirectUrl(req: Request, res: Response) {
  const { shortId } = req.params;

  const entry = await URL.findOne({ shortId });

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  entry.clicks++;
  await entry.save();

  return res.redirect(entry.originalUrl);
}

export async function handleGetUserUrls(req: Request, res: Response) {
  const userUrls = await URL
    .find({ createdBy: req.user!._id })
    .sort({ createdAt: -1 });
  const name = req.user!.fullName;

  let totalClicksOnUrls = 0;
  userUrls.forEach((url) => (totalClicksOnUrls += url.clicks));

  let mostClicksOnUrl = 0;
  userUrls.forEach(
    (url) => (mostClicksOnUrl = Math.max(url.clicks, mostClicksOnUrl)),
  );

  return res.render("home", {
    urls: userUrls,
    name,
    totalUrls: userUrls.length,
    totalClicks: totalClicksOnUrls,
    mostClicks: mostClicksOnUrl,
    shortId: req.query.shortId,
    message:
        req.query.error === "invalid-url"
            ? "Invalid URL"
            : null
  });
}
