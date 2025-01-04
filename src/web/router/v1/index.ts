import { Router } from "express";
import { AnalyzerControllerInterface } from "../../controller/v1/analyzer";
import { newAnalyzerRouter } from "./analyzer";
import { NotFoundException } from "../../exception/not-found-exception";
import { ERROR_CODES } from "../../../constant/error";
import { newHealthRouter } from "./health";

export const newV1Router = async ({
    analyzerController,
}: {
    analyzerController: AnalyzerControllerInterface;
}): Promise<Router> => {
    const v1 = Router();
    v1.use("/health", await newHealthRouter());
    v1.use("/analyzer", await newAnalyzerRouter(analyzerController));

    v1.use("*", (_req, res) => {
        console.log(`not_found_for_v1`, _req.method, _req.baseUrl);
        throw new NotFoundException(ERROR_CODES.E_PAGE_NOT_FOUND, "", [
            `Cannot ${_req.method} ${_req.baseUrl}`,
        ]);
    });

    return v1;
};
