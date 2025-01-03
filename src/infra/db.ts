import { Document, DeleteResult, UpdateResult } from "mongodb/mongodb";

export interface DBInterface {
    create<T extends Document>(collectionName: string, model: T): Promise<T>;
    update(collectionName: string, predicate: object, toUpdate: object): Promise<UpdateResult<Document>>;
    delete(collectionName: string, predicate: object): Promise<DeleteResult>;
    findOne<T extends Document>(collectionName: string, predicate: Record<string, any>): Promise<T | null>;
    count(collectionName: string, predicate: Record<string, any>): Promise<number>;
}
