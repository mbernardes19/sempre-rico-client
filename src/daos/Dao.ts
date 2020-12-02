export default interface Dao<T> {
    findAll(): Promise<T[]>
    findOne(id: string|number): Promise<T>
}



