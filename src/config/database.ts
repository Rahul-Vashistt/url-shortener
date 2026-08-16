import mongoose from "mongoose";

export async function connectToMongoDB(url: string) {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected!");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}
