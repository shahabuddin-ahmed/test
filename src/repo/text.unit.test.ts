import { newTextRepo, TextRepo } from "../repo/text";
import { DBInterface } from "../infra/db";
import { TextInterface } from "../model/text";
import { ObjectId } from "mongodb";

// Mock the DBInterface
const mockDB: DBInterface = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    insertMany: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
};

describe("TextRepo Unit Tests", () => {
    let textRepo: TextRepo;
    const mockText: TextInterface = { content: "The quick brown fox" };
    const mockTextID = "60adf93310b25c3878d7be52"; // Example ObjectId
    const collection = "texts";

    beforeEach(() => {
        textRepo = new TextRepo(mockDB, collection);
    });

    it("should create a new text", async () => {
        (mockDB.create as jest.Mock).mockResolvedValue(mockText);

        const result = await textRepo.create(mockText);

        expect(mockDB.create).toHaveBeenCalledWith(collection, mockText);
        expect(result).toEqual(mockText);
    });

    it("should update an existing text", async () => {
        const updatedText = { content: "The lazy dog" };
        (mockDB.update as jest.Mock).mockResolvedValue(updatedText);

        const result = await textRepo.update(mockTextID, updatedText);

        expect(mockDB.update).toHaveBeenCalledWith(
            collection,
            { _id: new ObjectId(mockTextID) },
            updatedText
        );
        expect(result).toEqual(updatedText);
    });

    it("should get a text by ID", async () => {
        (mockDB.findOne as jest.Mock).mockResolvedValue(mockText);

        const result = await textRepo.get(mockTextID);

        expect(mockDB.findOne).toHaveBeenCalledWith(collection, { _id: new ObjectId(mockTextID) });
        expect(result).toEqual(mockText);
    });

    it("should return null if text not found", async () => {
        (mockDB.findOne as jest.Mock).mockResolvedValue(null);

        const result = await textRepo.get(mockTextID);

        expect(mockDB.findOne).toHaveBeenCalledWith(collection, { _id: new ObjectId(mockTextID) });
        expect(result).toBeNull();
    });

    it("should count texts based on predicate", async () => {
        (mockDB.count as jest.Mock).mockResolvedValue(10);

        const result = await textRepo.count({});

        expect(mockDB.count).toHaveBeenCalledWith(collection, {});
        expect(result).toBe(10);
    });

    it("should return an instance of TextRepo", async () => {
        const textRepo = await newTextRepo(mockDB, collection);

        expect(textRepo).toBeInstanceOf(TextRepo);
        expect((textRepo as any).db).toBe(mockDB);
        expect((textRepo as any).collection).toBe(collection);
    });
});