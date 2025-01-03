import { TextRepoInterface } from "../repo/text";
import { Controller } from "../web/controller/controller";
import { TextInterface } from "../model/text";

export interface TextServiceInterface {
    create(text: TextInterface): Promise<any>;
}

export class TextService extends Controller implements TextServiceInterface {
    constructor(public textRepo: TextRepoInterface) {
        super();
        this.textRepo = textRepo;
    }

    public async create(text: TextInterface): Promise<any> {
        return await this.textRepo.create(text);
    }
}

export const newTextService = async (
    textRepo: TextRepoInterface
): Promise<TextService> => {
    return new TextService(textRepo);
};