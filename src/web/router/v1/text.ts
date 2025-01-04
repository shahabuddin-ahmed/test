import { TextControllerInterface } from './../../controller/v1/text';
import { Router } from "express";
import { asyncHandler } from "../../middleware/async-hander";

export const newTextRouter = async (
    textController: TextControllerInterface
): Promise<Router> => {
    const router = Router();

    router.post("/create", asyncHandler(textController.create));
    router.get("/words-count", asyncHandler(textController.getWordsCount));
    router.get("/characters-count", asyncHandler(textController.getCharactersCount));
    router.get("/sentences-count", asyncHandler(textController.getSentencesCount));
    router.get("/paragraphs-count", asyncHandler(textController.getParagraphsCount));
    router.get("/longest-word", asyncHandler(textController.getLongestWord));

    return router;
};
