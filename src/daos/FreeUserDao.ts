import Dao from './Dao';
import FreeUserDto, {FreeUserIdDto} from '../model/FreeUserDto';
import { connectionPool } from '../db';
import { Pool } from 'mysql2/promise';

export default class FreeUserDao implements Dao<FreeUserDto> {
    private _connectionPool: Pool
    constructor() {
        this._connectionPool = connectionPool;
    }

    async findAll(): Promise<FreeUserDto[]> {
        const [res] = await this._connectionPool.query<FreeUserDto[]>('SELECT * FROM UsuarioGratuito')
        return res;
    }

    async findOne(id: number): Promise<FreeUserDto> {
        const [res] = await this._connectionPool.query<FreeUserDto[]>(`SELECT * FROM UsuarioGratuito WHERE id = ${id}`)
        return res[0];
    }

    async getAllUsersIds(): Promise<FreeUserIdDto[]> {
        try {
            const [res] = await this._connectionPool.query<FreeUserIdDto[]>(`SELECT id FROM UsuarioGratuito`);
            return res;
        } catch (err) {
            console.log(new Date(), err)
        }
    }
}


