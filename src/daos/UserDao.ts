import { Connection } from 'mysql2/promise';
import GenericDao from './GenericDao';
import UserDto, { UserIdDto } from '../model/UserDto';

export default class UserDao extends GenericDao<UserDto> {
    constructor(connection: Connection) {
        super(connection);
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
        console.log(this._connection)
        const [res] = await this._connection.query<UserIdDto[]>(`SELECT id FROM Usuario`);
        return res;
    }
}


