import jwt from "jsonwebtoken";
import "dotenv/config";

import type { JwtPayload } from "jsonwebtoken";
import type { User } from "../models/user.model.js";

interface CustomJwtPayload extends JwtPayload {
    userId: string,
}

function fetchJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("JWT_SECRET is missing")
    }

    return secret;
}

export function createToken(user: User): string {
    const secret = fetchJwtSecret();

    try {
        const token = jwt.sign({
            userId: user._id.toString()
        }, secret, { expiresIn: '7d' })
        return token;
    } catch (err) {
        throw new Error("Failed to create token");
    }
}

export function verifyToken(token: string): string | null {
    const secret = fetchJwtSecret();

    try {
        const decoded = jwt.verify(token, secret) as CustomJwtPayload;

        if (
            typeof decoded.userId !== "string" ||
            !decoded.userId
        ) {
            return null;
        }

        return decoded.userId;

    } catch {
        return null;
    }
}