import { Request, Response } from "express";
import { TextServiceInterface } from "../../../service/text";
import { Controller } from "../controller";
import Joi from "joi";

export interface TextControllerInterface {
    create(req: Request, res: Response): any;
}

export class TextController extends Controller implements TextControllerInterface {
    textService: TextServiceInterface;
    constructor(textService: TextServiceInterface) {
        super();
        this.textService = textService;
        this.create = this.create.bind(this);
    }

    async create(req: Request, res: Response): Promise<any> {
        const data = await this.textService.create(req.body);
        return await this.sendResponse({ response: data }, 200, res);

    }
}

export const newTextV1Controller = async (textService: TextServiceInterface):
    Promise<TextController> => {
    return new TextController(textService);
};