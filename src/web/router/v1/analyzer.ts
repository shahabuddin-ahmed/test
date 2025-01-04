import { authorizedUser } from './../../middleware/authorized-user';
import { AnalyzerControllerInterface } from "./../../controller/v1/analyzer";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newAnalyzerRouter = async (
    analyzerController: AnalyzerControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", authorizedUser, asyncHandler(analyzerController.create));
    router.get("/words-count",  authorizedUser, asyncHandler(analyzerController.getWordsCount));
    router.get(
        "/characters-count", authorizedUser,
        asyncHandler(analyzerController.getCharactersCount)
    );
    router.get(
        "/sentences-count", authorizedUser,
        asyncHandler(analyzerController.getSentencesCount)
    );
    router.get(
        "/paragraphs-count", authorizedUser,
        asyncHandler(analyzerController.getParagraphsCount)
    );
    router.get(
        "/longest-word", authorizedUser,
        asyncHandler(analyzerController.getLongestWord)
    );

    return router;
};
