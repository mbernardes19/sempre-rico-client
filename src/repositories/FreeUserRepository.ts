import UserMapper from "../mappers/UserMapper";
import FreeUserDao from "../daos/FreeUserDao";

export default class FreeUserRepository {
    private _dao: FreeUserDao;
    private _mapper: UserMapper;

    constructor(dao: FreeUserDao, mapper: UserMapper) {
        this._dao = dao;
        this._mapper = mapper
    }

    async getAllUsersId(): Promise<number[]> {
        const usersIds = await this._dao.getAllUsersIds()
        return usersIds.map(userId => userId.id);
    }
    
}