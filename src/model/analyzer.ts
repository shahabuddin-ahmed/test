export interface AnalyzerInterface {
    id?: string;
    content: string;
    wordsCount: number;
    charactersCount: number;
    sentencesCount: number;
    paragraphsCount: number;
    longestWord: string;
    createdBy?: number | undefined;
    updatedBy?: number | undefined;
    createdAt?: Date | string | undefined;
    updatedAt?: Date | string | undefined;
}

export class AnalyzerModel implements AnalyzerInterface {
    id?: string;
    content: string;
    wordsCount: number;
    charactersCount: number;
    sentencesCount: number;
    paragraphsCount: number;
    longestWord: string;
    createdBy: number | undefined;
    updatedBy: number | undefined;
    createdAt: Date | string | undefined;
    updatedAt: Date | string | undefined;

    constructor(analyzer: AnalyzerInterface) {
        const { id, content, wordsCount, charactersCount, sentencesCount, paragraphsCount, longestWord, createdBy, updatedBy, createdAt, updatedAt } = analyzer;
        this.id = id;
        this.content = content;
        this.wordsCount = wordsCount;
        this.charactersCount = charactersCount;
        this.sentencesCount = sentencesCount;
        this.paragraphsCount = paragraphsCount;
        this.longestWord = longestWord;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export const newAnalyzerModel = async (analyzer: AnalyzerInterface) => {
    return new AnalyzerModel(analyzer);
};
