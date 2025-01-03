import { TextControllerInterface } from './../../controller/v1/text';
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newTextRouter = async (
    textController: TextControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/signup", asyncHandler(textController.create));

    return router;
};
