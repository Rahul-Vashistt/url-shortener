import type { NextFunction, Request, Response } from "express";

export function restrictToRole(roles: string[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        if (!req.user) {
            return res.redirect("/user/login");
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).render("unauthorized");
        }

        return next();
    };
}