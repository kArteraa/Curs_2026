import { BaseModel } from "./BaseModel";

/**
 * Модель направления/типа путевки
 */
export class Destination extends BaseModel {
    public name: string;
    public description?: string;

    constructor(data: Partial<Destination> = {}) {
        super(data);
        this.name = data.name || "";
        this.description = data.description;
    }

    public toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            name: this.name,
            description: this.description,
        };
    }
}
