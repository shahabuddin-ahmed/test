import { newTextRepo, TextRepoInterface } from "../repo/text";
import { newMongoDB } from "../infra/mongo";
import { MongoClient, Db } from "mongodb";
import { newTextService, TextService } from "../service/text";

let textService: TextService;
let textRepo: TextRepoInterface;
let rawDb: Db;
const collectionName = "texts";

beforeAll(async () => {
    const url = "mongodb://localhost:27017";
    const dbName = "test";
    const client = new MongoClient(url);

    try {
        await client.connect();
        rawDb = client.db(dbName);
        const db = await newMongoDB(client, dbName);
        textRepo = await newTextRepo(db, collectionName);
        textService = await newTextService(textRepo);
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

describe("TextService Integration Tests", () => {
    it("should create a new text and retrieve word count", async () => {
        const text = { content: "The quick brown fox jumps over the lazy dog." };
        const createdText = await textService.create(text);

        expect(createdText).toHaveProperty("_id");
        expect(createdText.content).toBe(text.content);

        const wordCount = await textService.getWordsCount(createdText.id as string);
        expect(wordCount).toBe(9); // 9 words in the text
    });

    it("should calculate character count excluding spaces and punctuation", async () => {
        const text = { content: "The quick brown fox jumps over the lazy dog." };
        const createdText = await textService.create(text);

        const charCount = await textService.getCharactersCount(createdText.id as string);
        expect(charCount).toBe(35); // 35 characters excluding spaces and punctuation
    });

    it("should calculate sentence count", async () => {
        const text = { content: "Hello world. This is a test. Let's count sentences!" };
        const createdText = await textService.create(text);

        const sentenceCount = await textService.getSentencesCount(createdText.id as string);
        expect(sentenceCount).toBe(3); // 3 sentences in the text
    });

    it("should calculate paragraph count", async () => {
        const text = { content: "Paragraph one.\nParagraph two.\n\nParagraph three." };
        const createdText = await textService.create(text);

        const paragraphCount = await textService.getParagraphsCount(createdText.id as string);
        expect(paragraphCount).toBe(3); // 3 paragraphs in the text
    });

    it("should find the longest word", async () => {
        const text = { content: "A quick brown fox jumps over the lazy dog." };
        const createdText = await textService.create(text);

        const longestWord = await textService.getLongestWord(createdText.id as string);
        expect(longestWord).toBe("quick"); // "quick" is the longest word
    });

    it("should throw an error when attempting to get a non-existent text", async () => {
        const nonExistentId = "64adf93310b25c3878d7be52"; // Non-existent ID

        await expect(textService.getWordsCount(nonExistentId)).rejects.toThrow("Text not found");
    });

    it("should handle text with punctuation and normalize it", async () => {
        const text = { content: "Wow! What a great day. Isn't it wonderful?" };
        const createdText = await textService.create(text);

        const wordCount = await textService.getWordsCount(createdText.id as string);
        expect(wordCount).toBe(8); // 8 words after removing punctuation
    });

    it("should delete a text and ensure it no longer exists", async () => {
        const text = { content: "This text will be deleted." };
        const createdText = await textService.create(text);

        const deleteResult = await textRepo.delete(createdText.id as string);
        expect(deleteResult).toEqual({ acknowledged: true, deletedCount: 1 });

        await expect(textService.getWordsCount(createdText.id as string)).rejects.toThrow("Text not found");
    });

    it("should update a text and reflect changes in analysis", async () => {
        const text = { content: "Old content." };
        const createdText = await textService.create(text);

        await textRepo.update(createdText.id as string, { content: "Updated text with new content." });

        const wordCount = await textService.getWordsCount(createdText.id as string);
        expect(wordCount).toBe(5); // 5 words in the updated text
    });
});
