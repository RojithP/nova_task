import type { Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}
export default function (req: Request, res: Response, next: any) {
    try {
        const token = req.headers.authorization;
        const secret = process.env.SECRET;
        if (token) {
            const decoded = verify(token, secret);
            (req as CustomRequest).token = decoded;
            next();
        } else {
            res.status(401).json({ message: "Token must be provided!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
