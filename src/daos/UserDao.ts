import { Connection } from 'mysql2/promise';
import Dao from './Dao';
import UserDto, { UserIdDto } from '../model/UserDto';

export default class UserDao implements Dao<UserDto> {
    private _connection: Connection;
    constructor(connection: Connection) {
        this._connection = connection;
    }

    async findAll(): Promise<UserDto[]> {
        const [res] = await this._connection.query<UserDto[]>('SELECT * FROM Usuario')
        return res;
    }

    async findOne(id: number): Promise<UserDto> {
        const [res] = await this._connection.query<UserDto[]>(`SELECT * FROM Usuario WHERE id = ${id}`)
        return res[0];
    }

    async getAllUsersIds(): Promise<UserIdDto[]> {
        const [res] = await this._connection.query<UserIdDto[]>(`SELECT id FROM Usuario`);
        return res;
    }
}


