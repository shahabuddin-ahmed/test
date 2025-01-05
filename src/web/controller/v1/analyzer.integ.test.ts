import request from "supertest";
import express, { Express } from "express";
import { newAnalyzerV1Controller } from "../v1/analyzer";
import { newAnalyzerService } from "../../../service/analyzer";
import { newAnalyzerRepo } from "../../../repo/analyzer";
import { newMongoDB } from "../../../infra/mongo";
import { MongoClient, Db } from "mongodb";
import bodyParser from "body-parser";

let app: Express;
let rawDb: Db;
let mongoClient: MongoClient;

const dbName = "test";
const collectionName = "text";

beforeAll(async () => {
    const mongoUrl = "mongodb://localhost:27017";
    mongoClient = new MongoClient(mongoUrl);

    await mongoClient.connect();
    rawDb = mongoClient.db(dbName);

    const db = await newMongoDB(mongoClient, dbName);
    const analyzerRepo = await newAnalyzerRepo(db, collectionName);
    const analyzerService = await newAnalyzerService(analyzerRepo);
    const analyzerController = await newAnalyzerV1Controller(analyzerService);

    app = express();
    app.use(bodyParser.json());

    app.post("/analyze/create", analyzerController.create);
    app.get("/analyze/words-count", analyzerController.getWordsCount);
    app.get("/analyze/characters-count", analyzerController.getCharactersCount);
    app.get("/analyze/sentences-count", analyzerController.getSentencesCount);
    app.get("/analyze/paragraphs-count", analyzerController.getParagraphsCount);
    app.get("/analyze/longest-word", analyzerController.getLongestWord);
});

beforeEach(async () => {
    try {
        await rawDb.dropCollection(collectionName);
    } catch (error) {
        console.log(error);
    }
    await rawDb.createCollection(collectionName);
});

afterAll(async () => {
    await mongoClient.close();
});

describe("AnalyzerController Integration Tests", () => {
    it("should create a text analysis entry", async () => {
        const response = await request(app).post("/analyze/create").send({
            content: "A quick brown fox jumps over the lazy dog.",
            createdBy: 1,
        });

        expect(response.status).toBe(200);
        expect(response.body.code).toBe("SUCCESS");
        expect(response.body.response.content).toBe("A quick brown fox jumps over the lazy dog.");
        expect(response.body.response.id).toBeDefined();
        expect(response.body.response.wordsCount).toBe(9);
        expect(response.body.response.charactersCount).toBe(33); // 33 characters excluding spaces
        expect(response.body.response.sentencesCount).toBe(1);
        expect(response.body.response.paragraphsCount).toBe(1);
        expect(response.body.response.longestWord).toBe("quick");
        expect(response.body.response.createdAt).toBeDefined();
        expect(response.body.response.updatedAt).toBeDefined();
    });

    it("should return word count for a given text", async () => {
        const createResponse = await request(app).post("/analyze/create").send({
            content: "A quick brown fox jumps over the lazy dog.",
            createdBy: 1,
        });

        const analyzerId = createResponse.body.response.id;

        const response = await request(app).get("/analyze/words-count").query({ analyzerId });

        expect(response.status).toBe(200);
        expect(response.body.code).toBe("SUCCESS");
        expect(response.body.response.count).toBe(9); // 9 words
    });

    it("should return character count for a given text", async () => {
        const createResponse = await request(app).post("/analyze/create").send({
            content: "A quick brown fox jumps over the lazy dog.",
            createdBy: 1,
        });

        const analyzerId = createResponse.body.response.id;

        const response = await request(app).get("/analyze/characters-count").query({ analyzerId });

        expect(response.status).toBe(200);
        expect(response.body.code).toBe("SUCCESS");
        expect(response.body.response.count).toBe(33); // 33 characters excluding spaces
    });

    it("should return sentence count for a given text", async () => {
        const createResponse = await request(app).post("/analyze/create").send({
            content: "A quick brown fox jumps. The lazy dog sleeps.",
            createdBy: 1,
        });

        const analyzerId = createResponse.body.response.id;

        const response = await request(app).get("/analyze/sentences-count").query({ analyzerId });

        expect(response.status).toBe(200);
        expect(response.body.code).toBe("SUCCESS");
        expect(response.body.response.count).toBe(2); // 2 sentences
    });

    it("should return paragraph count for a given text", async () => {
        const createResponse = await request(app).post("/analyze/create").send({
            content: "Paragraph one.\nParagraph two.\n\nParagraph three.",
            createdBy: 1,
        });

        const analyzerId = createResponse.body.response.id;

        const response = await request(app).get("/analyze/paragraphs-count").query({ analyzerId });

        expect(response.status).toBe(200);
        expect(response.body.code).toBe("SUCCESS");
        expect(response.body.response.count).toBe(3); // 3 paragraphs
    });

    it("should return the longest word in the text", async () => {
        const createResponse = await request(app).post("/analyze/create").send({
            content: "A quick brown fox jumps over the lazy dog.",
            createdBy: 1,
        });

        const analyzerId = createResponse.body.response.id;

        const response = await request(app).get("/analyze/longest-word").query({ analyzerId });

        expect(response.status).toBe(200);
        expect(response.body.code).toBe("SUCCESS");
        expect(response.body.response.word).toBe("quick");
    });
});
