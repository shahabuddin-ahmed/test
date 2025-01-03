import { DBInterface } from "./db";
import { MongoClient, Db, Sort, Document, DeleteResult, UpdateResult } from "mongodb";


export class MongoDB implements DBInterface {
    db: Db;
    dbClient: MongoClient;

    constructor(mongoClient: MongoClient, dbName: string) {
        this.dbClient = mongoClient;
        this.db = mongoClient.db(dbName);
    }

    public async findOne<T extends Document>(collectionName: string, predicate: Record<string, any>): Promise<T | null> {
        const row = await this.db.collection(collectionName).findOne(predicate);
        if (row) {
            return { ...row, id: row._id } as unknown as T & { id: typeof row._id };
        }
        return null;
    }

    public async create<T extends Document>(collectionName: string, model: T): Promise<T> {
        const result = await this.db.collection(collectionName).insertOne(model);
        if (!result.acknowledged) {
            throw new Error("Failed to insert");
        }
        return { ...model, id: result.insertedId };
    }

    public async update(collectionName: string, predicate: object, toUpdate: object): Promise<UpdateResult<Document>> {
        return this.db.collection(collectionName).updateOne(predicate, { $set: toUpdate });
    }

    public async delete(collectionName: string, predicate: object, ): Promise<DeleteResult> {
        return this.db.collection(collectionName).deleteOne(predicate);
    }

    public async count(collectionName: string, predicate: Record<string, any>, ): Promise<number> {
        return this.db.collection(collectionName).countDocuments(predicate);
    }
}

export const newMongoDB = async (mongoClient: MongoClient, dbName: string): Promise<DBInterface> => {
    return new MongoDB(mongoClient, dbName);
};


export const initializeDBConnection = async (dbURI: string, dbName: string): Promise<DBInterface> => {
    const client = new MongoClient(dbURI);

    try {
        await client.connect();
        console.log("Connected successfully to the database server");
    } catch (err) {
        console.log("failed to connect the database server");
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log(err);
        }
        process.exit(1);
    }

    return newMongoDB(client, dbName);
};

export default MongoDB;