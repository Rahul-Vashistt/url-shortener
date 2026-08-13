import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { router } from "./routes/page.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { urlRouter } from "./routes/url.routes.js";

import { checkAuth } from "./middlewares/auth.middleware.js";
import { connectToMongoDB } from "./config/database.js";

const app = express();
const PORT = 3000;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("MONGO_URI is missing");
}

await connectToMongoDB(mongoUri);

app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkAuth);

app.use("/", router);
app.use("/user", authRouter);
app.use("/url", urlRouter);

app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err);

        return res
            .status(500)
            .send("Internal server error");
    }
);

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});