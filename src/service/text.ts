import { TextRepoInterface } from "../repo/text";
import { TextInterface } from "../model/text";
import { Controller } from "../web/controller/controller";
import { BadRequestException } from "../web/exception/bad-request-exception";
import { ERROR_CODES } from "../constant/error";

export interface TextServiceInterface {
    create(text: TextInterface): Promise<TextInterface>;
    getWordsCount(textID: string): Promise<number>;
    getCharactersCount(textID: string): Promise<number>;
    getSentencesCount(textID: string): Promise<number>;
    getParagraphsCount(textID: string): Promise<number>;
    getLongestWord(textID: string): Promise<string>;
}

export class TextService extends Controller implements TextServiceInterface {
    constructor(public textRepo: TextRepoInterface) {
        super();
        this.textRepo = textRepo;
    }

    public async create(text: TextInterface): Promise<TextInterface> {
        return await this.textRepo.create(text);
    }

    public async getWordsCount(textID: string): Promise<number> {
        const text = await this.get(textID);
        const sanitizedText = text.replace(/[^\w\s]/g, "").toLowerCase();
        return sanitizedText.split(/\s+/).filter(Boolean).length;
    }

    public async getCharactersCount(textID: string): Promise<number> {
        const text = await this.get(textID);
        return text.replace(/[^\w]/g, "").length;
    }

    public async getSentencesCount(textID: string): Promise<number> {
        const text = await this.get(textID);
        return text.split(/[.!?]+/).filter(Boolean).length;
    }

    public async getParagraphsCount(textID: string): Promise<number> {
        const text = await this.get(textID);
        return text.split("\n").filter(Boolean).length;
    }

    public async getLongestWord(textID: string): Promise<string> {
        const text = await this.get(textID);
        const sanitizedText = text.replace(/[^\w\s]/g, "").toLowerCase();
        const words = sanitizedText.split(/\s+/);
        return words.reduce((longest, current) => (current.length > longest.length ? current : longest), "");
    }

    private async get(textID: string): Promise<string> {
        const text = await this.textRepo.get(textID);
        if (!text) {
            throw new BadRequestException(ERROR_CODES.BAD_REQUEST, "Text not found");
        }
        return text.content;
    }
}

export const newTextService = async (
    textRepo: TextRepoInterface
): Promise<TextService> => {
    return new TextService(textRepo);
};