import { Router } from "express";
import { TextControllerInterface } from "../../controller/v1/text";
import { newTextRouter } from "./text";
import { NotFoundException } from "../../exception/not-found-exception";
import { ERROR_CODES } from "../../../constant/error";
import { newHealthRouter } from "./health";

export const newV1Router = async ({
    textController,
}: {
    textController: TextControllerInterface;
}): Promise<Router> => {
    const v1 = Router();
    v1.use("/health", await newHealthRouter());
    v1.use("/text", await newTextRouter(textController));

    v1.use("*", (_req, res) => {
        console.log(`not_found_for_v1`, _req.method, _req.baseUrl);
        throw new NotFoundException(ERROR_CODES.E_PAGE_NOT_FOUND, "", [
            `Cannot ${_req.method} ${_req.baseUrl}`,
        ]);
    });

    return v1;
};
