export interface AnalyzerInterface {
    id?: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export class AnalyzerModel implements AnalyzerInterface {
    id?: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;

    constructor(analyzer: AnalyzerInterface) {
        const { id, content, createdAt, updatedAt } = analyzer;
        this.id = id;
        this.content = content;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }
}

export const newAnalyzerModel = async (analyzer: AnalyzerInterface) => {
    return new AnalyzerModel(analyzer);
};
