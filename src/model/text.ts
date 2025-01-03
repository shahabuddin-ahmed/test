export interface TextInterface {
    id?: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;

}

export class TextModel implements TextInterface {
    id?: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;

    constructor(text: TextInterface) {
        const { id, content, createdAt, updatedAt } = text;
        this.id = id;
        this.content = content;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }
}

export const newTextModel = async (text: TextInterface) => {
    return new TextModel(text);
};