import "dotenv/config";
import app from "./app.js";
import { connectToMongoDB } from "./config/database.js";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("MONGO_URI is missing");
}

await connectToMongoDB(mongoUri);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});