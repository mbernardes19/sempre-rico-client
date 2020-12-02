import { Connection } from 'mysql2/promise';
import Dao from './Dao';
import FreeUserDto, {FreeUserIdDto} from '../model/FreeUserDto';

export default class FreeUserDao implements Dao<FreeUserDto> {
    private _connection: Connection;
    constructor(connection: Connection) {
        this._connection = connection;
    }

    async findAll(): Promise<FreeUserDto[]> {
        const [res] = await this._connection.query<FreeUserDto[]>('SELECT * FROM UsuarioGratuito')
        return res;
    }

    async findOne(id: number): Promise<FreeUserDto> {
        const [res] = await this._connection.query<FreeUserDto[]>(`SELECT * FROM UsuarioGratuito WHERE id = ${id}`)
        return res[0];
    }

    async getAllUsersIds(): Promise<FreeUserIdDto[]> {
        try {
            const [res] = await this._connection.query<FreeUserIdDto[]>(`SELECT id FROM UsuarioGratuito`);
            return res;
        } catch (err) {
            console.log(new Date(), err)
        }
    }
}


