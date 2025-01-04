import { Request, Response } from "express";
import { TextServiceInterface } from "../../../service/text";
import { Controller } from "../controller";
import Joi from "joi";

export interface TextControllerInterface {
    create(req: Request, res: Response): any;
    getWordsCount(req: Request, res: Response): any;
    getCharactersCount(req: Request, res: Response): any;
    getSentencesCount(req: Request, res: Response): any;
    getParagraphsCount(req: Request, res: Response): any;
    getLongestWord(req: Request, res: Response): any;
}

export class TextController extends Controller implements TextControllerInterface {
    textService: TextServiceInterface;
    constructor(textService: TextServiceInterface) {
        super();
        this.textService = textService;
        this.create = this.create.bind(this);
        this.getWordsCount = this.getWordsCount.bind(this);
        this.getCharactersCount = this.getCharactersCount.bind(this);
        this.getSentencesCount = this.getSentencesCount.bind(this);
        this.getParagraphsCount = this.getParagraphsCount.bind(this);
        this.getLongestWord = this.getLongestWord.bind(this);
    }

    async create(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            content: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.body);

        const data = await this.textService.create(value);
        return await this.sendResponse({ response: data }, 200, res);
    }

    async getWordsCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            textId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.textService.getWordsCount(value.textId);
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getCharactersCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            textId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.textService.getCharactersCount(value.textId);
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getSentencesCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            textId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.textService.getSentencesCount(value.textId);
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getParagraphsCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            textId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.textService.getParagraphsCount(value.textId);
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getLongestWord(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            textId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const word = await this.textService.getLongestWord(value.textId);
        return await this.sendResponse({ response: { word } }, 200, res);
    }
}

export const newTextV1Controller = async (textService: TextServiceInterface):
    Promise<TextController> => {
    return new TextController(textService);
};