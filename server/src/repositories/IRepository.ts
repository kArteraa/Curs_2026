/**
 * Интерфейс репозитория (Repository Pattern)
 * Определяет базовые операции для работы с данными
 */
export interface IRepository<T> {
    /**
     * Найти сущность по ID
     */
    findById(id: number): Promise<T | null>;

    /**
     * Найти все сущности
     */
    findAll(): Promise<T[]>;

    /**
     * Создать новую сущность
     */
    create(entity: Partial<T>): Promise<T>;

    /**
     * Обновить сущность
     */
    update(id: number, entity: Partial<T>): Promise<T | null>;

    /**
     * Удалить сущность
     */
    delete(id: number): Promise<boolean>;
}
