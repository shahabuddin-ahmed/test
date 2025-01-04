import { AnalyzerControllerInterface } from "./../../controller/v1/analyzer";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newAnalyzerRouter = async (
    analyzerController: AnalyzerControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", asyncHandler(analyzerController.create));
    router.get("/words-count", asyncHandler(analyzerController.getWordsCount));
    router.get(
        "/characters-count",
        asyncHandler(analyzerController.getCharactersCount)
    );
    router.get(
        "/sentences-count",
        asyncHandler(analyzerController.getSentencesCount)
    );
    router.get(
        "/paragraphs-count",
        asyncHandler(analyzerController.getParagraphsCount)
    );
    router.get(
        "/longest-word",
        asyncHandler(analyzerController.getLongestWord)
    );

    return router;
};
