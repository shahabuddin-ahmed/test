import { newAnalyzerRepo, AnalyzerRepo } from "./analyzer";
import { DBInterface } from "../infra/db";
import { AnalyzerInterface } from "../model/analyzer";
import { ObjectId } from "mongodb";

// Mock the DBInterface
const mockDB: DBInterface = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
};

describe("AnalyzerRepo Unit Tests", () => {
    let analyzerRepo: AnalyzerRepo;
    const mockAnalyzer: AnalyzerInterface = { content: "The quick brown fox" };
    const mockAnalyzerID = "60adf93310b25c3878d7be52"; // Example ObjectId
    const collection = "analyzers";

    beforeEach(() => {
        analyzerRepo = new AnalyzerRepo(mockDB, collection);
    });

    it("should create a new analyzer", async () => {
        (mockDB.create as jest.Mock).mockResolvedValue(mockAnalyzer);

        const result = await analyzerRepo.create(mockAnalyzer);

        expect(mockDB.create).toHaveBeenCalledWith(collection, mockAnalyzer);
        expect(result).toEqual(mockAnalyzer);
    });

    it("should update an existing analyzer", async () => {
        const updatedAnalyzer = { content: "The lazy dog" };
        (mockDB.update as jest.Mock).mockResolvedValue(updatedAnalyzer);

        const result = await analyzerRepo.update(
            mockAnalyzerID,
            updatedAnalyzer
        );

        expect(mockDB.update).toHaveBeenCalledWith(
            collection,
            { _id: new ObjectId(mockAnalyzerID) },
            updatedAnalyzer
        );
        expect(result).toEqual(updatedAnalyzer);
    });

    it("should delete a analyzer by ID", async () => {
        (mockDB.delete as jest.Mock).mockResolvedValue({
            acknowledged: true,
            deletedCount: 1,
        });

        const result = await analyzerRepo.delete(mockAnalyzerID);

        expect(mockDB.delete).toHaveBeenCalledWith(collection, {
            _id: new ObjectId(mockAnalyzerID),
        });
        expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });

    it("should handle delete with no matching document", async () => {
        (mockDB.delete as jest.Mock).mockResolvedValue({
            acknowledged: true,
            deletedCount: 0,
        });

        const result = await analyzerRepo.delete(mockAnalyzerID);

        expect(mockDB.delete).toHaveBeenCalledWith(collection, {
            _id: new ObjectId(mockAnalyzerID),
        });
        expect(result).toEqual({ acknowledged: true, deletedCount: 0 });
    });

    it("should get a analyzer by ID", async () => {
        (mockDB.findOne as jest.Mock).mockResolvedValue(mockAnalyzer);

        const result = await analyzerRepo.get(mockAnalyzerID);

        expect(mockDB.findOne).toHaveBeenCalledWith(collection, {
            _id: new ObjectId(mockAnalyzerID),
        });
        expect(result).toEqual(mockAnalyzer);
    });

    it("should return null if analyzer not found", async () => {
        (mockDB.findOne as jest.Mock).mockResolvedValue(null);

        const result = await analyzerRepo.get(mockAnalyzerID);

        expect(mockDB.findOne).toHaveBeenCalledWith(collection, {
            _id: new ObjectId(mockAnalyzerID),
        });
        expect(result).toBeNull();
    });

    it("should count analyzers based on predicate", async () => {
        (mockDB.count as jest.Mock).mockResolvedValue(10);

        const result = await analyzerRepo.count({});

        expect(mockDB.count).toHaveBeenCalledWith(collection, {});
        expect(result).toBe(10);
    });

    it("should return an instance of AnalyzerRepo", async () => {
        const analyzerRepo = await newAnalyzerRepo(mockDB, collection);

        expect(analyzerRepo).toBeInstanceOf(AnalyzerRepo);
        expect((analyzerRepo as any).db).toBe(mockDB);
        expect((analyzerRepo as any).collection).toBe(collection);
    });
});
