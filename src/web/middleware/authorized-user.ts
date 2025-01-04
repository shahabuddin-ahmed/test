import { NextFunction, Request, Response } from "express";
import config from "../../config/config";
import { ERROR_CODES } from "../../constant/error";
import { UnauthorizedException } from "../exception/unauthrozied-exception";


export const authorizedUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const API_KEY = req.query.API_KEY || req.headers.accesstoken;
        if (API_KEY !== config.API_KEY) {
            throw new UnauthorizedException(ERROR_CODES.E_UNAUTHORIZED);
        }
    
        return next();
    } catch (err) {
        next(err);
    }
};