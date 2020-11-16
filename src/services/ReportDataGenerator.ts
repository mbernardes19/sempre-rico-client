import UserRepository from "../repositories/UserRepository";
import AirgramClient from "../model/AirgramClient";

export default class ReportDataGenerator {
    private _currentUserList: number[];
    private _userRepository: UserRepository;
    private _airgramClient: AirgramClient;
    private _enteringUsers: number[]
    private _leavingUsers: number[]
    private channelId: number;

    constructor(airgramClient: AirgramClient, channelId: number) {
        this._airgramClient = airgramClient;
        this.channelId = channelId
    }

    private async getUpdatedUserList() {
        const res = await this._airgramClient.getChatMembersFromChannel(this.channelId);
        return res.map(r => r.userId);
    }

    async updateUserList() {
        this._currentUserList = await this.getUpdatedUserList();
        console.log(this._currentUserList);
    }

    async getEnteringUsers() {
        const updatedUserList = await this.getUpdatedUserList();
        const newUsers = updatedUserList.filter(user => !this._currentUserList.includes(user))
        this._enteringUsers = newUsers;
        return newUsers;
    }

    async getLeavingUsers() {
        const updatedUserList = await this.getUpdatedUserList();
        const leavingUsers = this._currentUserList.filter(user => !updatedUserList.includes(user))
        this._leavingUsers = leavingUsers;
        return leavingUsers;
    }
}