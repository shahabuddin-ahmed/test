import { newAnalyzerRepo, AnalyzerRepoInterface } from "../repo/analyzer";
import { newMongoDB } from "../infra/mongo";
import { MongoClient, Db } from "mongodb";
import { newAnalyzerService, AnalyzerService } from "../service/analyzer";

let analyzerService: AnalyzerService;
let analyzerRepo: AnalyzerRepoInterface;
let rawDb: Db;
const collectionName = "analyzers";

beforeAll(async () => {
    const url = "mongodb://localhost:27017";
    const dbName = "test";
    const client = new MongoClient(url);

    try {
        await client.connect();
        rawDb = client.db(dbName);
        const db = await newMongoDB(client, dbName);
        analyzerRepo = await newAnalyzerRepo(db, collectionName);
        analyzerService = await newAnalyzerService(analyzerRepo);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error(err);
        }
    }
});

beforeEach(async () => {
    try {
        await rawDb.dropCollection(collectionName);
    } catch (err) {}
});

afterAll(async () => {
    try {
        await rawDb.dropCollection(collectionName);
    } catch (err) {}
});

describe("AnalyzerService Integration Tests", () => {
    it("should create a new analyzer and retrieve word count", async () => {
        const analyzer = {
            content: "The quick brown fox jumps over the lazy dog.",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        expect(createdAnalyzer).toHaveProperty("_id");
        expect(createdAnalyzer.content).toBe(analyzer.content);

        const wordCount = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(wordCount).toBe(9); // 9 words in the analyzer
    });

    it("should calculate character count excluding spaces and punctuation", async () => {
        const analyzer = {
            content: "The quick brown fox jumps over the lazy dog.",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const charCount = await analyzerService.getCharactersCount(
            createdAnalyzer.id as string
        );
        expect(charCount).toBe(35); // 35 characters excluding spaces and punctuation
    });

    it("should calculate sentence count", async () => {
        const analyzer = {
            content: "Hello world. This is a test. Let's count sentences!",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const sentenceCount = await analyzerService.getSentencesCount(
            createdAnalyzer.id as string
        );
        expect(sentenceCount).toBe(3); // 3 sentences in the analyzer
    });

    it("should calculate paragraph count", async () => {
        const analyzer = {
            content: "Paragraph one.\nParagraph two.\n\nParagraph three.",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const paragraphCount = await analyzerService.getParagraphsCount(
            createdAnalyzer.id as string
        );
        expect(paragraphCount).toBe(3); // 3 paragraphs in the analyzer
    });

    it("should find the longest word", async () => {
        const analyzer = {
            content: "A quick brown fox jumps over the lazy dog.",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const longestWord = await analyzerService.getLongestWord(
            createdAnalyzer.id as string
        );
        expect(longestWord).toBe("quick"); // "quick" is the longest word
    });

    it("should throw an error when attempting to get a non-existent analyzer", async () => {
        const nonExistentId = "64adf93310b25c3878d7be52"; // Non-existent ID

        await expect(
            analyzerService.getWordsCount(nonExistentId)
        ).rejects.toThrow("Analyzer not found");
    });

    it("should handle analyzer with punctuation and normalize it", async () => {
        const analyzer = {
            content: "Wow! What a great day. Isn't it wonderful?",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const wordCount = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(wordCount).toBe(8); // 8 words after removing punctuation
    });

    it("should delete a analyzer and ensure it no longer exists", async () => {
        const analyzer = { content: "This analyzer will be deleted." };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const deleteResult = await analyzerRepo.delete(
            createdAnalyzer.id as string
        );
        expect(deleteResult).toEqual({ acknowledged: true, deletedCount: 1 });

        await expect(
            analyzerService.getWordsCount(createdAnalyzer.id as string)
        ).rejects.toThrow("Analyzer not found");
    });

    it("should update a analyzer and reflect changes in analysis", async () => {
        const analyzer = { content: "Old content." };
        const createdAnalyzer = await analyzerService.create(analyzer);

        await analyzerRepo.update(createdAnalyzer.id as string, {
            content: "Updated analyzer with new content.",
        });

        const wordCount = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(wordCount).toBe(5); // 5 words in the updated analyzer
    });
});
