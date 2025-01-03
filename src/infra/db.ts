import { Sort, Document } from "mongodb/mongodb";

export interface DBInterface {
    create<T extends Document>(collectionName: string, model: T): Promise<T>;
    update(collectionName: string, predicate: object, toUpdate: object): Promise<any>;
    delete(collectionName: string, predicate: object): Promise<any>;
    findOne(collectionName: string, predicate: Record<string, any>): Promise<any>;
    count(collectionName: string, predicate: Record<string, any>): Promise<number>;
}
