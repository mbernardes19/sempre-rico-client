import UserDao from "../daos/UserDao";
import UserMapper from "../mappers/UserMapper";

export default class UserRepository {
    private _dao: UserDao;
    private _mapper: UserMapper;

    constructor(dao: UserDao, mapper: UserMapper) {
        this._dao = dao;
        this._mapper = mapper
    }

    async getAllUsersId(): Promise<number[]> {
        const usersIds = await this._dao.getAllUsersIds()
        return usersIds.map(userId => userId.id);
    }
}