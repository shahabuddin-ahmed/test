import {
    newAnalyzerService,
    AnalyzerService,
    AnalyzerServiceInterface,
} from "./analyzer";
import { AnalyzerRepoInterface } from "../repo/analyzer";
import { AnalyzerInterface } from "../model/analyzer";
import { BadRequestException } from "../web/exception/bad-request-exception";

describe("AnalyzerService Unit Tests", () => {
    let analyzerService: AnalyzerServiceInterface;
    let mockAnalyzerRepo: jest.Mocked<AnalyzerRepoInterface>;

    const mockAnalyzer: AnalyzerInterface = {
        content: "The quick brown fox jumps over the lazy dog.",
    };
    const mockAnalyzerID = "60adf93310b25c3878d7be52";

    beforeEach(() => {
        mockAnalyzerRepo = {
            create: jest.fn(),
            update: jest.fn(),
            get: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
        };
        analyzerService = new AnalyzerService(mockAnalyzerRepo);
    });

    it("should create a new analyzer", async () => {
        mockAnalyzerRepo.create.mockResolvedValue(mockAnalyzer);

        const result = await analyzerService.create(mockAnalyzer);

        expect(mockAnalyzerRepo.create).toHaveBeenCalledWith(mockAnalyzer);
        expect(result).toEqual(mockAnalyzer);
    });

    it("should return word count", async () => {
        mockAnalyzerRepo.get.mockResolvedValue(mockAnalyzer);

        const result = await analyzerService.getWordsCount(mockAnalyzerID);

        expect(mockAnalyzerRepo.get).toHaveBeenCalledWith(mockAnalyzerID);
        expect(result).toBe(9); // 9 words in the mock analyzer
    });

    it("should return character count (excluding spaces)", async () => {
        mockAnalyzerRepo.get.mockResolvedValue(mockAnalyzer);

        const result = await analyzerService.getCharactersCount(mockAnalyzerID);

        expect(mockAnalyzerRepo.get).toHaveBeenCalledWith(mockAnalyzerID);
        expect(result).toBe(35); // 35 characters excluding spaces
    });

    it("should return sentence count", async () => {
        mockAnalyzerRepo.get.mockResolvedValue(mockAnalyzer);

        const result = await analyzerService.getSentencesCount(mockAnalyzerID);

        expect(mockAnalyzerRepo.get).toHaveBeenCalledWith(mockAnalyzerID);
        expect(result).toBe(1); // 1 sentence in the mock analyzer
    });

    it("should return paragraph count", async () => {
        const multiParagraphAnalyzer: AnalyzerInterface = {
            content: "Paragraph one.\nParagraph two.\n\nParagraph three.",
        };
        mockAnalyzerRepo.get.mockResolvedValue(multiParagraphAnalyzer);

        const result = await analyzerService.getParagraphsCount(mockAnalyzerID);

        expect(mockAnalyzerRepo.get).toHaveBeenCalledWith(mockAnalyzerID);
        expect(result).toBe(3); // 3 paragraphs in the analyzer
    });

    it("should return the longest word", async () => {
        mockAnalyzerRepo.get.mockResolvedValue(mockAnalyzer);

        const result = await analyzerService.getLongestWord(mockAnalyzerID);

        expect(mockAnalyzerRepo.get).toHaveBeenCalledWith(mockAnalyzerID);
        expect(result).toBe("quick"); // "quick" is the longest word in the mock analyzer
    });

    it("should throw error if analyzer not found", async () => {
        mockAnalyzerRepo.get.mockResolvedValue(null);

        await expect(
            analyzerService.getWordsCount(mockAnalyzerID)
        ).rejects.toThrow(BadRequestException);
        expect(mockAnalyzerRepo.get).toHaveBeenCalledWith(mockAnalyzerID);
    });

    it("should throw error with correct error code if analyzer not found", async () => {
        mockAnalyzerRepo.get.mockResolvedValue(null);

        try {
            await analyzerService.getWordsCount(mockAnalyzerID);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe(
                "Analyzer not found"
            );
        }
    });

    it("should create an instance of AnalyzerService", async () => {
        const analyzerService = await newAnalyzerService(mockAnalyzerRepo);

        expect(analyzerService).toBeInstanceOf(AnalyzerService);
        expect((analyzerService as any).analyzerRepo).toBe(mockAnalyzerRepo);
    });
});
