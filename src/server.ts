import "dotenv/config";
import app from "./app.js";
import { connectToMongoDB } from "./config/database.js";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("MONGO_URI is missing");
}

await connectToMongoDB(mongoUri);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started at PORT: ${PORT}`);
});