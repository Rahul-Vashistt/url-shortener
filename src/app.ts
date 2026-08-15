import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import { router } from "./routes/page.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { urlRouter } from "./routes/url.routes.js";
import { checkAuth } from "./middlewares/auth.middleware.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkAuth);

app.use("/", router);
app.use("/user", authRouter);
app.use("/url", urlRouter);

app.use((req, res) => {
    return res.status(404).render("notFound");
});

app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err);
        return res.status(500).render("error");
    }
);

export default app;