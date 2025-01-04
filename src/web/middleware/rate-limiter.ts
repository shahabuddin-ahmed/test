import { TooManyRequestException } from "../exception/too-many-request-exception";
import { ERROR_CODES } from "../../constant/error";
import { NextFunction, Request, Response } from "express";

const rateLimiter = (options: { windowMs: number; max: number }) => {
    const requests: { [key: string]: { count: number; timestamp: number } } =
        {};

    return (req: Request, res: Response, next: NextFunction) => {
        const now = Date.now();
        const userIP = req.ip || "unknown";

        if (!requests[userIP]) {
            requests[userIP] = { count: 1, timestamp: now };
        } else {
            const timePassed = now - requests[userIP].timestamp;

            if (timePassed > options.windowMs) {
                requests[userIP].count = 1;
                requests[userIP].timestamp = now;
            } else {
                requests[userIP].count += 1;
            }
        }

        if (requests[userIP].count > options.max) {
            next(new TooManyRequestException(ERROR_CODES.TOO_MANY_REQUEST));
        } else {
            next();
        }
    };
};

// Define a rate limiter for a specific endpoint
export const createAnalyzerLimiter = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Max 5 requests per 1 minute
});

export const getAnalyzerLimiter = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Max 10 requests per 1 minute
});
