import { Request, Response } from "express";
import { AnalyzerServiceInterface } from "../../../service/analyzer";
import { Controller } from "../controller";
import Joi from "joi";

export interface AnalyzerControllerInterface {
    create(req: Request, res: Response): any;
    getWordsCount(req: Request, res: Response): any;
    getCharactersCount(req: Request, res: Response): any;
    getSentencesCount(req: Request, res: Response): any;
    getParagraphsCount(req: Request, res: Response): any;
    getLongestWord(req: Request, res: Response): any;
}

export class AnalyzerController
    extends Controller
    implements AnalyzerControllerInterface
{
    analyzerService: AnalyzerServiceInterface;
    constructor(analyzerService: AnalyzerServiceInterface) {
        super();
        this.analyzerService = analyzerService;
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
            createdBy: Joi.number().integer().optional(),
        });

        const { value } = await this.validateRequest(schema, req.body);

        const data = await this.analyzerService.create(value);
        return await this.sendResponse({ response: data }, 200, res);
    }

    async getWordsCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            analyzerId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.analyzerService.getWordsCount(
            value.analyzerId
        );
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getCharactersCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            analyzerId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.analyzerService.getCharactersCount(
            value.analyzerId
        );
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getSentencesCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            analyzerId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.analyzerService.getSentencesCount(
            value.analyzerId
        );
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getParagraphsCount(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            analyzerId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const count = await this.analyzerService.getParagraphsCount(
            value.analyzerId
        );
        return await this.sendResponse({ response: { count } }, 200, res);
    }

    async getLongestWord(req: Request, res: Response): Promise<any> {
        const schema = Joi.object().keys({
            analyzerId: Joi.string().required(),
        });

        const { value } = await this.validateRequest(schema, req.query);

        const word = await this.analyzerService.getLongestWord(
            value.analyzerId
        );
        return await this.sendResponse({ response: { word } }, 200, res);
    }
}

export const newAnalyzerV1Controller = async (
    analyzerService: AnalyzerServiceInterface
): Promise<AnalyzerController> => {
    return new AnalyzerController(analyzerService);
};
