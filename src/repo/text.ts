import { TextInterface } from "../model/text";
import { DBInterface } from "../infra/db";
import { DeleteResult, ObjectId, UpdateResult } from "mongodb";

export interface TextRepoInterface {
    create(text: TextInterface): Promise<TextInterface>;
    update(textID: string, text: TextInterface): Promise<UpdateResult<Document>>;
    delete(textID: string): Promise<DeleteResult>;
    get(textID: string): Promise<TextInterface | null>;
    count(predicate: object): Promise<number>;
}

export class TextRepo implements TextRepoInterface {
    constructor(public db: DBInterface, public collection: string) {
        this.db = db;
        this.collection = collection;
    }

    public async create(text: TextInterface): Promise<TextInterface> {
        return this.db.create(this.collection, text);
    }

    public async update(textID: string, text: TextInterface): Promise<UpdateResult<Document>> {
        return this.db.update(this.collection, { _id: new ObjectId(textID) }, text);
    }

    public async delete(textID: string): Promise<any> {
        return this.db.delete(this.collection, { _id: new ObjectId(textID) });
    }

    public async get(textID: string): Promise<TextInterface | null> {
        return this.db.findOne(this.collection, { _id: new ObjectId(textID) });
    }

    public async count(predicate: object): Promise<number> {
        return this.db.count(this.collection, predicate);
    }
}

export const newTextRepo = async (db: DBInterface, collection: string): Promise<TextRepoInterface> => {
    return new TextRepo(db, collection);
};

export default TextRepo;