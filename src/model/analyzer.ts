export interface AnalyzerInterface {
    id?: string;
    content: string;
    createdBy: number;
    updatedBy?: number | undefined;
    createdAt?: Date | string | undefined;
    updatedAt?: Date | string | undefined;
}

export class AnalyzerModel implements AnalyzerInterface {
    id?: string;
    content: string;
    createdBy: number;
    updatedBy: number | undefined;
    createdAt: Date | string | undefined;
    updatedAt: Date | string | undefined;

    constructor(analyzer: AnalyzerInterface) {
        const { id, content, createdBy, updatedBy, createdAt, updatedAt } = analyzer;
        this.id = id;
        this.content = content;
        this.content = content;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export const newAnalyzerModel = async (analyzer: AnalyzerInterface) => {
    return new AnalyzerModel(analyzer);
};
