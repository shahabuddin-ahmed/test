import { newTextRepo, TextRepoInterface } from "./text";
import { newMongoDB } from "../infra/mongo";
import { MongoClient, Db } from "mongodb";
import { TextInterface  } from "../model/text";

let textRepo: TextRepoInterface;
let rawDb: Db;
const collectionName = "text";

beforeAll(async () => {
    const url = "mongodb://localhost:27017";
    const dbName = "test";
    const client = new MongoClient(url);
    try {
        await client.connect();
        rawDb = client.db(dbName);
        const db = await newMongoDB(client, dbName);
        textRepo = await newTextRepo(db, collectionName);
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

describe("TextRepo Integ text repo get", () => {
    it("It should return null", async () => {
        const text = await textRepo.get("60adf93310b25c3878d7be58");
        expect(text).toBe(null);
    });

    it("It should return a text", async () => {
        const textCreated = await textRepo.create({
            content: "this is text content",
        });

        const text = await textRepo.get(textCreated.id as string);
        expect(text).not.toBe(null);
        expect((text as TextInterface).content).toBe("this is text content");
    });
});

describe("TextRepo Integ text repo create", () => {
    it("It should create text", async () => {
        const text = await textRepo.create({
            content: "xx",
        });
        expect(text.id).toBeTruthy();
        expect(text.id).not.toBe(null);
    });
});

describe("TextRepo Integ text repo update", () => {
    it("It should update text", async () => {
        const text = await textRepo.create({
            content: "xx",
        });

        await textRepo.update(text.id as string, {
            content: "yy",
        });

        const updatedText = await textRepo.get(text.id as string);

        expect(updatedText).not.toBe(null);
        expect(updatedText!.content).toBe("yy");
    });
});

describe("TextRepo Integ text repo delete", () => {
    it("It should delete text", async () => {
        const text = await textRepo.create({
            content: "xx",
        });

        const deletedText = await textRepo.delete(text.id as string);
        expect(deletedText).not.toBe(null);
        expect(deletedText).toEqual({ acknowledged: true, deletedCount: 1 });
    });
});

describe("TextRepo Integ text repo count", () => {
    it("It should count text", async () => {
        let counter = 0;
        await textRepo.create({
            content: "xx",
        });

        counter = await textRepo.count({});
        expect(counter).toEqual(1);

        await textRepo.create({
            content: "yy",
        });

        counter = await textRepo.count({});
        expect(counter).toEqual(2);
    });
});