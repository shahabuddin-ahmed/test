import { TextInterface } from "../model/text";
import { DBInterface } from "../infra/db";
import { ObjectId } from "mongodb";

export interface TextRepoInterface {
    create(text: TextInterface): Promise<TextInterface>;
    update(textID: string, text: TextInterface): Promise<any>;
    delete(textID: string): Promise<any>;
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

    public async update(textID: string, text: TextInterface): Promise<any> {
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