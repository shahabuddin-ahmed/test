import { Request, Response, NextFunction } from "express";
import { errorMessages, ERROR_CODES } from "../../constant/error";
import { ResponseType } from "../controller/controller";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const traceId = `B2C${Date.now()}`
    console.error(`Error caught by global handler: traceId-${traceId}`, err);
    const statusCode = err.statusCode || 500;
    const errorMessage = statusCode === 500 || !err.message ? errorMessages.E_INTERNAL_SERVER_ERROR.message : err.message;

    return res.status(statusCode).send({
        code: statusCode === 500 || !err.code ? ERROR_CODES.E_INTERNAL_SERVER_ERROR : err.code,
        message: errorMessage,
        response: null,
        traceId,
        errors: err.errors || [errorMessage]
    } as ResponseType);
};
