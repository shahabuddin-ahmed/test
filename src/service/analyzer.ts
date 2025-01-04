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

export class AnalyzerService
    extends Controller
    implements AnalyzerServiceInterface
{
    constructor(public analyzerRepo: AnalyzerRepoInterface) {
        super();
        this.analyzerRepo = analyzerRepo;
    }

    public async create(
        analyzer: AnalyzerInterface
    ): Promise<AnalyzerInterface> {
        return await this.analyzerRepo.create(analyzer);
    }

    public async getWordsCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        const sanitizedAnalyzer = analyzer
            .replace(/[^\w\s]/g, "")
            .toLowerCase();
        return sanitizedAnalyzer.split(/\s+/).filter(Boolean).length;
    }

    public async getCharactersCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        return analyzer.replace(/[^\w]/g, "").length;
    }

    public async getSentencesCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        return analyzer.split(/[.!?]+/).filter(Boolean).length;
    }

    public async getParagraphsCount(analyzerId: string): Promise<number> {
        const analyzer = await this.get(analyzerId);
        return analyzer.split("\n").filter(Boolean).length;
    }

    public async getLongestWord(analyzerId: string): Promise<string> {
        const analyzer = await this.get(analyzerId);
        const sanitizedAnalyzer = analyzer
            .replace(/[^\w\s]/g, "")
            .toLowerCase();
        const words = sanitizedAnalyzer.split(/\s+/);
        return words.reduce(
            (longest, current) =>
                current.length > longest.length ? current : longest,
            ""
        );
    }

    private async get(analyzerId: string): Promise<string> {
        const analyzer = await this.analyzerRepo.get(analyzerId);
        if (!analyzer) {
            throw new BadRequestException(
                ERROR_CODES.BAD_REQUEST,
                "Analyzer not found"
            );
        }
        return analyzer.content;
    }
}

export const newAnalyzerService = async (
    analyzerRepo: AnalyzerRepoInterface
): Promise<AnalyzerService> => {
    return new AnalyzerService(analyzerRepo);
};
