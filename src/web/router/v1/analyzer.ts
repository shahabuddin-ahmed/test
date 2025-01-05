import { createAnalyzerLimiter, getAnalyzerLimiter } from "../../middleware/rate-limiter";
import { AnalyzerControllerInterface } from "./../../controller/v1/analyzer";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newAnalyzerRouter = async (
    analyzerController: AnalyzerControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", createAnalyzerLimiter, asyncHandler(analyzerController.create));
    router.get("/words-count", getAnalyzerLimiter, asyncHandler(analyzerController.getWordsCount));
    router.get("/characters-count", getAnalyzerLimiter, asyncHandler(analyzerController.getCharactersCount));
    router.get("/sentences-count", getAnalyzerLimiter, asyncHandler(analyzerController.getSentencesCount));
    router.get("/paragraphs-count", getAnalyzerLimiter, asyncHandler(analyzerController.getParagraphsCount));
    router.get("/longest-word", getAnalyzerLimiter, asyncHandler(analyzerController.getLongestWord));

    return router;
};
