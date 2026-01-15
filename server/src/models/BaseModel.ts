/**
 * Базовый класс для всех моделей данных
 * Реализует общую функциональность для работы с сущностями
 */
export abstract class BaseModel {
    public id?: number;
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor(data?: Partial<BaseModel>) {
        if (data) {
            this.id = data.id;
            this.createdAt = data.createdAt;
            this.updatedAt = data.updatedAt;
        }
    }

    /**
     * Преобразовать модель в объект для JSON
     */
    public toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
