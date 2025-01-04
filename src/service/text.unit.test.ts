import { newTextService, TextService, TextServiceInterface } from "../service/text";
import { TextRepoInterface } from "../repo/text";
import { TextInterface } from "../model/text";
import { BadRequestException } from "../web/exception/bad-request-exception";

describe("TextService Unit Tests", () => {
    let textService: TextServiceInterface;
    let mockTextRepo: jest.Mocked<TextRepoInterface>;

    const mockText: TextInterface = { content: "The quick brown fox jumps over the lazy dog." };
    const mockTextID = "60adf93310b25c3878d7be52";

    beforeEach(() => {
        mockTextRepo = {
            create: jest.fn(),
            update: jest.fn(),
            get: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
        };
        textService = new TextService(mockTextRepo);
    });

    it("should create a new text", async () => {
        mockTextRepo.create.mockResolvedValue(mockText);

        const result = await textService.create(mockText);

        expect(mockTextRepo.create).toHaveBeenCalledWith(mockText);
        expect(result).toEqual(mockText);
    });

    it("should return word count", async () => {
        mockTextRepo.get.mockResolvedValue(mockText);

        const result = await textService.getWordsCount(mockTextID);

        expect(mockTextRepo.get).toHaveBeenCalledWith(mockTextID);
        expect(result).toBe(9); // 9 words in the mock text
    });

    it("should return character count (excluding spaces)", async () => {
        mockTextRepo.get.mockResolvedValue(mockText);

        const result = await textService.getCharactersCount(mockTextID);

        expect(mockTextRepo.get).toHaveBeenCalledWith(mockTextID);
        expect(result).toBe(35); // 35 characters excluding spaces
    });

    it("should return sentence count", async () => {
        mockTextRepo.get.mockResolvedValue(mockText);

        const result = await textService.getSentencesCount(mockTextID);

        expect(mockTextRepo.get).toHaveBeenCalledWith(mockTextID);
        expect(result).toBe(1); // 1 sentence in the mock text
    });

    it("should return paragraph count", async () => {
        const multiParagraphText: TextInterface = {
            content: "Paragraph one.\nParagraph two.\n\nParagraph three.",
        };
        mockTextRepo.get.mockResolvedValue(multiParagraphText);

        const result = await textService.getParagraphsCount(mockTextID);

        expect(mockTextRepo.get).toHaveBeenCalledWith(mockTextID);
        expect(result).toBe(3); // 3 paragraphs in the text
    });

    it("should return the longest word", async () => {
        mockTextRepo.get.mockResolvedValue(mockText);

        const result = await textService.getLongestWord(mockTextID);

        expect(mockTextRepo.get).toHaveBeenCalledWith(mockTextID);
        expect(result).toBe("quick"); // "quick" is the longest word in the mock text
    });

    it("should throw error if text not found", async () => {
        mockTextRepo.get.mockResolvedValue(null);

        await expect(textService.getWordsCount(mockTextID)).rejects.toThrow(BadRequestException);
        expect(mockTextRepo.get).toHaveBeenCalledWith(mockTextID);
    });

    it("should throw error with correct error code if text not found", async () => {
        mockTextRepo.get.mockResolvedValue(null);

        try {
            await textService.getWordsCount(mockTextID);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe("Text not found");
        }
    });

    it("should create an instance of TextService", async () => {
        const textService = await newTextService(mockTextRepo);

        expect(textService).toBeInstanceOf(TextService);
        expect((textService as any).textRepo).toBe(mockTextRepo);
    });
});
