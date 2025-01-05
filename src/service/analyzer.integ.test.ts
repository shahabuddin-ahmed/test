import { newAnalyzerRepo, AnalyzerRepoInterface } from "../repo/analyzer";
import { newMongoDB } from "../infra/mongo";
import { MongoClient, Db } from "mongodb";
import { newAnalyzerService, AnalyzerService } from "../service/analyzer";
import { AnalyzerInterface } from "../model/analyzer";

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

describe("AnalyzerService Integration Tests with Caching", () => {
    it("should create a new analyzer and retrieve word count", async () => {
        const analyzer: AnalyzerInterface = {
            content: "The quick brown fox jumps over the lazy dog.",
            createdBy: 1,
            wordsCount: 9, // Pre-calculated values
            charactersCount: 35,
            sentencesCount: 1,
            paragraphsCount: 1,
            longestWord: "quick",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        expect(createdAnalyzer).toHaveProperty("id");
        expect(createdAnalyzer.content).toBe(analyzer.content);
        expect(createdAnalyzer.wordsCount).toBe(9);

        const wordCount = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(wordCount).toBe(9);
    });

    it("should use cache to retrieve an analyzer", async () => {
        const analyzer: AnalyzerInterface = {
            content: "Caching test content.",
            createdBy: 1,
            wordsCount: 3,
            charactersCount: 21,
            sentencesCount: 1,
            paragraphsCount: 1,
            longestWord: "Caching",
        };

        const createdAnalyzer = await analyzerService.create(analyzer);

        const fetchedAnalyzer1 = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(fetchedAnalyzer1).toBe(3);

        await analyzerRepo.update(createdAnalyzer.id as string, {
            ...analyzer,
            wordsCount: 5,
        });

        const fetchedAnalyzer2 = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(fetchedAnalyzer2).toBe(3);
    });

    it("should calculate character count excluding spaces and punctuation", async () => {
        const analyzer: AnalyzerInterface = {
            content: "The quick brown fox jumps over the lazy dog.",
            createdBy: 1,
            wordsCount: 9,
            charactersCount: 35,
            sentencesCount: 1,
            paragraphsCount: 1,
            longestWord: "quick",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const charCount = await analyzerService.getCharactersCount(
            createdAnalyzer.id as string
        );
        expect(charCount).toBe(35); // 35 characters excluding spaces and punctuation
    });

    it("should calculate sentence count", async () => {
        const analyzer: AnalyzerInterface = {
            content: "Hello world. This is a test. Let's count sentences!",
            createdBy: 1,
            wordsCount: 7,
            charactersCount: 43,
            sentencesCount: 3,
            paragraphsCount: 1,
            longestWord: "sentences",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const sentenceCount = await analyzerService.getSentencesCount(
            createdAnalyzer.id as string
        );
        expect(sentenceCount).toBe(3); // 3 sentences in the analyzer
    });

    it("should calculate paragraph count", async () => {
        const analyzer: AnalyzerInterface = {
            content: "Paragraph one.\nParagraph two.\n\nParagraph three.",
            createdBy: 1,
            wordsCount: 9,
            charactersCount: 52,
            sentencesCount: 3,
            paragraphsCount: 3,
            longestWord: "Paragraph",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const paragraphCount = await analyzerService.getParagraphsCount(
            createdAnalyzer.id as string
        );
        expect(paragraphCount).toBe(3); // 3 paragraphs in the analyzer
    });

    it("should find the longest word", async () => {
        const analyzer: AnalyzerInterface = {
            content: "A quick brown fox jumps over the lazy dog.",
            createdBy: 1,
            wordsCount: 9,
            charactersCount: 35,
            sentencesCount: 1,
            paragraphsCount: 1,
            longestWord: "quick",
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
        const analyzer: AnalyzerInterface = {
            content: "Wow! What a great day. Isn't it wonderful?",
            createdBy: 1,
            wordsCount: 8,
            charactersCount: 38,
            sentencesCount: 3,
            paragraphsCount: 1,
            longestWord: "wonderful",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const wordCount = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(wordCount).toBe(8); // 8 words after removing punctuation
    });

    it("should delete an analyzer and ensure it no longer exists", async () => {
        const analyzer: AnalyzerInterface = {
            content: "This analyzer will be deleted.",
            createdBy: 1,
            wordsCount: 5,
            charactersCount: 30,
            sentencesCount: 1,
            paragraphsCount: 1,
            longestWord: "deleted",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const deleteResult = await analyzerRepo.delete(
            createdAnalyzer.id as string
        );
        expect(deleteResult).toEqual({ acknowledged: true, deletedCount: 1 });

        await expect(
            analyzerService.getWordsCount(createdAnalyzer.id as string)
        ).rejects.toThrow("Analyzer not found");
    });

    it("should update an analyzer and reflect changes in analysis", async () => {
        const analyzer: AnalyzerInterface = {
            content: "Old content.",
            createdBy: 1,
            wordsCount: 2,
            charactersCount: 12,
            sentencesCount: 1,
            paragraphsCount: 1,
            longestWord: "content",
        };
        const createdAnalyzer = await analyzerService.create(analyzer);

        const updatedAnalyzer: AnalyzerInterface = {
            content: "Updated analyzer with new content.",
            createdBy: 1,
            wordsCount: 5,
            charactersCount: 35,
            sentencesCount: 1,
            paragraphsCount: 1,
            longestWord: "updated",
        };

        await analyzerRepo.update(createdAnalyzer.id as string, updatedAnalyzer);

        const updated = await analyzerRepo.get(createdAnalyzer.id as string);

        expect(updated?.wordsCount).toBe(5); // 5 words in the updated analyzer

        const wordCount = await analyzerService.getWordsCount(
            createdAnalyzer.id as string
        );
        expect(wordCount).toBe(5); // 5 words in the updated analyzer
    });
});
