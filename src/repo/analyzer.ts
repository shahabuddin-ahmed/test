import { AnalyzerInterface } from "../model/analyzer";
import { DBInterface } from "../infra/db";
import { DeleteResult, ObjectId, UpdateResult } from "mongodb";

export interface AnalyzerRepoInterface {
    create(analyzer: AnalyzerInterface): Promise<AnalyzerInterface>;
    update(
        analyzerId: string,
        analyzer: AnalyzerInterface
    ): Promise<UpdateResult<Document>>;
    delete(analyzerId: string): Promise<DeleteResult>;
    get(analyzerId: string): Promise<AnalyzerInterface | null>;
    count(predicate: object): Promise<number>;
}

export class AnalyzerRepo implements AnalyzerRepoInterface {
    constructor(public db: DBInterface, public collection: string) {
        this.db = db;
        this.collection = collection;
    }

    public async create(
        analyzer: AnalyzerInterface
    ): Promise<AnalyzerInterface> {
        return this.db.create(this.collection, analyzer);
    }

    public async update(
        analyzerId: string,
        analyzer: AnalyzerInterface
    ): Promise<UpdateResult<Document>> {
        return this.db.update(
            this.collection,
            { _id: new ObjectId(analyzerId) },
            analyzer
        );
    }

    public async delete(analyzerId: string): Promise<any> {
        return this.db.delete(this.collection, {
            _id: new ObjectId(analyzerId),
        });
    }

    public async get(analyzerId: string): Promise<AnalyzerInterface | null> {
        return this.db.findOne(this.collection, {
            _id: new ObjectId(analyzerId),
        });
    }

    public async count(predicate: object): Promise<number> {
        return this.db.count(this.collection, predicate);
    }
}

export const newAnalyzerRepo = async (
    db: DBInterface,
    collection: string
): Promise<AnalyzerRepoInterface> => {
    return new AnalyzerRepo(db, collection);
};

export default AnalyzerRepo;
