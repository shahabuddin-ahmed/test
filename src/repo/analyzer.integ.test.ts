import { newAnalyzerRepo, AnalyzerRepoInterface } from "./analyzer";
import { newMongoDB } from "../infra/mongo";
import { MongoClient, Db } from "mongodb";
import { AnalyzerInterface } from "../model/analyzer";

let analyzerRepo: AnalyzerRepoInterface;
let rawDb: Db;
const collectionName = "analyzer";

beforeAll(async () => {
    const url = "mongodb://localhost:27017";
    const dbName = "test";
    const client = new MongoClient(url);
    try {
        await client.connect();
        rawDb = client.db(dbName);
        const db = await newMongoDB(client, dbName);
        analyzerRepo = await newAnalyzerRepo(db, collectionName);
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

describe("AnalyzerRepo Integ analyzer repo get", () => {
    it("It should return null", async () => {
        const analyzer = await analyzerRepo.get("60adf93310b25c3878d7be58");
        expect(analyzer).toBe(null);
    });

    it("It should return a analyzer", async () => {
        const analyzerCreated = await analyzerRepo.create({
            content: "this is analyzer content",
            createdBy: 1,
        });

        const analyzer = await analyzerRepo.get(analyzerCreated.id as string);
        expect(analyzer).not.toBe(null);
        expect((analyzer as AnalyzerInterface).content).toBe(
            "this is analyzer content"
        );
    });
});

describe("AnalyzerRepo Integ analyzer repo create", () => {
    it("It should create analyzer", async () => {
        const analyzer = await analyzerRepo.create({
            content: "xx",
            createdBy: 1,
        });
        expect(analyzer.id).toBeTruthy();
        expect(analyzer.id).not.toBe(null);
    });
});

describe("AnalyzerRepo Integ analyzer repo update", () => {
    it("It should update analyzer", async () => {
        const analyzer = await analyzerRepo.create({
            content: "xx",
            createdBy: 1,
        });

        await analyzerRepo.update(analyzer.id as string, {
            content: "yy",
            createdBy: 1,
        });

        const updatedAnalyzer = await analyzerRepo.get(analyzer.id as string);

        expect(updatedAnalyzer).not.toBe(null);
        expect(updatedAnalyzer!.content).toBe("yy");
    });
});

describe("AnalyzerRepo Integ analyzer repo delete", () => {
    it("It should delete analyzer", async () => {
        const analyzer = await analyzerRepo.create({
            content: "xx",
            createdBy: 1,
        });

        const deletedAnalyzer = await analyzerRepo.delete(
            analyzer.id as string
        );
        expect(deletedAnalyzer).not.toBe(null);
        expect(deletedAnalyzer).toEqual({
            acknowledged: true,
            deletedCount: 1,
        });
    });
});

describe("AnalyzerRepo Integ analyzer repo count", () => {
    it("It should count analyzer", async () => {
        let counter = 0;
        await analyzerRepo.create({
            content: "xx",
            createdBy: 1,
        });

        counter = await analyzerRepo.count({});
        expect(counter).toEqual(1);

        await analyzerRepo.create({
            content: "yy",
            createdBy: 1,
        });

        counter = await analyzerRepo.count({});
        expect(counter).toEqual(2);
    });
});
