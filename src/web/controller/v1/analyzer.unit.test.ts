import { AnalyzerController } from "../v1/analyzer";
import { AnalyzerServiceInterface } from "../../../service/analyzer";
import { Request, Response } from "express";

const mockAnalyzerService: jest.Mocked<AnalyzerServiceInterface> = {
    create: jest.fn(),
    getWordsCount: jest.fn(),
    getCharactersCount: jest.fn(),
    getSentencesCount: jest.fn(),
    getParagraphsCount: jest.fn(),
    getLongestWord: jest.fn(),
};

const mockRequest = (data: any) => ({
    body: data,
    query: data
});

const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe("AnalyzerController", () => {
    let controller: AnalyzerController;
    
    beforeEach(() => {
        controller = new AnalyzerController(mockAnalyzerService);
    });

    it("should create text", async () => {
        const requestBody = { content: "The quick brown fox jumps." };
        const mockRes = mockResponse();
        
        mockAnalyzerService.create.mockResolvedValue({ id: "123", content: "The quick brown fox jumps." });
        await controller.create(mockRequest(requestBody) as unknown as Request, mockRes);
        expect(mockAnalyzerService.create).toHaveBeenCalledWith({ content: "The quick brown fox jumps." });
    });

    it("should get words count", async () => {
        const requestQuery = { analyzerId: "123" };
        const mockRes = mockResponse();
        
        mockAnalyzerService.getWordsCount.mockResolvedValue(5);  // 5 words

        await controller.getWordsCount(mockRequest(requestQuery) as Partial<Request> as Request, mockRes);
        
        expect(mockAnalyzerService.getWordsCount).toHaveBeenCalledWith("123");
    });

    it("should get characters count", async () => {
        const requestQuery = { analyzerId: "123" };
        const mockRes = mockResponse();
        
        mockAnalyzerService.getCharactersCount.mockResolvedValue(35);  // 35 characters
        await controller.getCharactersCount(mockRequest(requestQuery) as Partial<Request> as Request, mockRes);
        expect(mockAnalyzerService.getCharactersCount).toHaveBeenCalledWith("123");
    });

    it("should get sentences count", async () => {
        const requestQuery = { analyzerId: "123" };
        const mockRes = mockResponse();
        
        mockAnalyzerService.getSentencesCount.mockResolvedValue(2);  // 2 sentences
        await controller.getSentencesCount(mockRequest(requestQuery) as unknown as Request, mockRes);
        expect(mockAnalyzerService.getSentencesCount).toHaveBeenCalledWith("123");
    });

    it("should get paragraphs count", async () => {
        const requestQuery = { analyzerId: "123" };
        const mockRes = mockResponse();
        
        mockAnalyzerService.getParagraphsCount.mockResolvedValue(3);  // 3 paragraphs
        await controller.getParagraphsCount(mockRequest(requestQuery) as Partial<Request> as Request, mockRes);
        expect(mockAnalyzerService.getParagraphsCount).toHaveBeenCalledWith("123");
    });

    it("should get the longest word", async () => {
        const requestQuery = { analyzerId: "123" };
        const mockRes = mockResponse();
        
        mockAnalyzerService.getLongestWord.mockResolvedValue("jumps");  // Longest word is "jumps"
        await controller.getLongestWord(mockRequest(requestQuery) as Partial<Request> as Request, mockRes);
        expect(mockAnalyzerService.getLongestWord).toHaveBeenCalledWith("123");
    });
});
