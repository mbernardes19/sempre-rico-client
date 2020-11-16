import { Connection } from 'mysql2/promise';

export default abstract class GenericDao<T> {
    protected _connection: Connection;
    constructor(connection: Connection) {
        this._connection = connection;
    }

    async abstract findAll(): Promise<T[]>
    async abstract findOne(id: string|number): Promise<T>
}



