import NodeCache from "node-cache";
import { AnalyzerRepoInterface } from "../repo/analyzer";
import { AnalyzerInterface } from "../model/analyzer";
import { Controller } from "../web/controller/controller";
import { BadRequestException } from "../web/exception/bad-request-exception";
import { ERROR_CODES } from "../constant/error";

export interface AnalyzerServiceInterface {
    create(analyzer: AnalyzerInterface): Promise<AnalyzerInterface>;
    getWordsCount(analyzerId: string): Promise<number>;
    getCharactersCount(analyzerId: string): Promise<number>;
    getSentencesCount(analyzerId: string): Promise<number>;
    getParagraphsCount(analyzerId: string): Promise<number>;
    getLongestWord(analyzerId: string): Promise<string>;
}

export class AnalyzerService extends Controller implements AnalyzerServiceInterface {
    private cache: NodeCache;

    constructor(public analyzerRepo: AnalyzerRepoInterface) {
        super();
        this.analyzerRepo = analyzerRepo;
        this.cache = new NodeCache({ stdTTL: 900, checkperiod: 60 });
    }

    public async create(analyzer: AnalyzerInterface): Promise<any> {
        const { wordsCount, charactersCount, sentencesCount, paragraphsCount, longestWord } = this.getAnalyzer(analyzer.content);

        return await this.analyzerRepo.create({
            ...analyzer,
            wordsCount,
            charactersCount,
            sentencesCount,
            paragraphsCount,
            longestWord,
        });
    }

    public async getWordsCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        return analyzer.wordsCount;
    }

    public async getCharactersCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        return analyzer.charactersCount;
    }

    public async getSentencesCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        return analyzer.sentencesCount;}

    public async getParagraphsCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        return analyzer.paragraphsCount;
    }

    public async getLongestWord(analyzerId: string): Promise<string> {
        const analyzer = await this.get(analyzerId);
        return analyzer.longestWord;
    }

    private async get(analyzerId: string): Promise<AnalyzerInterface> {
        const cachedAnalyzer = this.cache.get<AnalyzerInterface>(analyzerId);
        if (cachedAnalyzer) {
            return cachedAnalyzer;
        }

        const analyzer = await this.analyzerRepo.get(analyzerId);
        if (!analyzer) {
            throw new BadRequestException(
                ERROR_CODES.BAD_REQUEST,
                "Analyzer not found"
            );
        }

        this.cache.set(analyzerId, analyzer);
        return analyzer;
    }

    private getAnalyzer(text: string): {
        wordsCount: number;
        charactersCount: number;
        sentencesCount: number;
        paragraphsCount: number;
        longestWord: string;
    } {
        const sanitizedAnalyzer = text.replace(/[^\w\s]/g, "").toLowerCase();
        const words = sanitizedAnalyzer.split(/\s+/);

        const longestWord = words.reduce(
            (longest, current) =>
                current.length > longest.length ? current : longest,
            ""
        );

        const wordsCount = words.filter(Boolean).length;

        const charactersCount = text.replace(/[^\w]/g, "").length;
        const sentencesCount = text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphsCount = text.split("\n").filter(Boolean).length;

        return {
            wordsCount,
            charactersCount,
            sentencesCount,
            paragraphsCount,
            longestWord,
        };
    }
}

export const newAnalyzerService = async (
    analyzerRepo: AnalyzerRepoInterface
): Promise<AnalyzerService> => {
    return new AnalyzerService(analyzerRepo);
};
