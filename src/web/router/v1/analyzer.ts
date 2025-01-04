import { createAnalyzerLimiter, getAnalyzerLimiter } from "../../middleware/rate-limiter";
import { authorizedUser } from "./../../middleware/authorized-user";
import { AnalyzerControllerInterface } from "./../../controller/v1/analyzer";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newAnalyzerRouter = async (
    analyzerController: AnalyzerControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post(
        "/create",
        authorizedUser, createAnalyzerLimiter,
        asyncHandler(analyzerController.create)
    );
    router.get(
        "/words-count",
        authorizedUser, getAnalyzerLimiter,
        asyncHandler(analyzerController.getWordsCount)
    );
    router.get(
        "/characters-count",
        authorizedUser, getAnalyzerLimiter,
        asyncHandler(analyzerController.getCharactersCount)
    );
    router.get(
        "/sentences-count",
        authorizedUser, getAnalyzerLimiter,
        asyncHandler(analyzerController.getSentencesCount)
    );
    router.get(
        "/paragraphs-count",
        authorizedUser, getAnalyzerLimiter,
        asyncHandler(analyzerController.getParagraphsCount)
    );
    router.get(
        "/longest-word",
        authorizedUser, getAnalyzerLimiter,
        asyncHandler(analyzerController.getLongestWord)
    );

    return router;
};
