import AirgramClient, { UserInfo } from "../model/AirgramClient";
import { differenceInCalendarDays } from "date-fns";
import { TelegramChatMember } from "../model/Telegram";
import FreeUserRepository from "../repositories/FreeUserRepository";
import StatsDao from "../daos/StatsDao";

export default class ReportDataGenerator {
    private _currentUserList: TelegramChatMember[] = [];
    private _airgramClient: AirgramClient;
    private _freeUserRepository: FreeUserRepository
    private _statsDao: StatsDao;
    private channelId: number;

    constructor(airgramClient: AirgramClient, freeUserRepository: FreeUserRepository, statsDao: StatsDao, channelId: number) {
        this._airgramClient = airgramClient;
        this._freeUserRepository = freeUserRepository;
        this._statsDao = statsDao;
        this.channelId = channelId
    }

    async getUpdatedUserList() {
        const usersFromChannel = await this._airgramClient.getChatMembersFromChannel(this.channelId);
        const freeUsers = await this._freeUserRepository.getAllUsersId()
        return usersFromChannel.filter(user => freeUsers.includes(user.userId))
    }

    async updateUserList() {
        this._currentUserList = await this.getUpdatedUserList();
    }

    async getEnteringUsers() {
        const updatedUserList = await this.getUpdatedUserList();
        const currentUsersIds = this._currentUserList.map(user => user.userId);
        const newUsers = updatedUserList.filter(user => !currentUsersIds.includes(user.userId))
        return newUsers;
    }

    async getLeavingUsers() {
        const updatedUserList = await this.getUpdatedUserList();
        const updatedUsersIds = updatedUserList.map(user => user.userId);
        const leavingUsers = this._currentUserList.filter(user => !updatedUsersIds.includes(user.userId))
        return leavingUsers;
    }

    private async getUserTimeInChannel(userId: number): Promise<{userId: number, daysInChannel: number}> {
        const user = await this._airgramClient.getChatMember(userId, parseInt('-100'+this.channelId.toString()));
        const daysInChannel = differenceInCalendarDays(new Date(), user.joinedIn)
        return {userId: userId, daysInChannel: daysInChannel}
    }

    async getAllUsersTimeInChannel(): Promise<{userId: number, daysInChannel: number}[]> {
        const updatedUserList = await this.getUpdatedUserList();
        const asyncActions = []
        updatedUserList.forEach(user => asyncActions.push(this.getUserTimeInChannel(user.userId)))

        let usersTime;
        try {
            usersTime = await Promise.all(asyncActions)
        } catch (err) {
            console.log(err)
        }

        return usersTime;
    }

    async getUsersWithAtLeastSevenDaysOfTimeInChannel(today: Date,leavingUsers: TelegramChatMember[]) {
        const allUsersTime = await this.getAllUsersTimeInChannel();
        const userIdsWithAtLeastSevenDays = allUsersTime.filter(user => user.daysInChannel >= 7).map(user => user.userId)

        const asyncActions: Promise<{userId: number, daysInChannel}>[] = [];
        leavingUsers.forEach(leavingUser => asyncActions.push(this.getUserTimeInChannel(leavingUser.userId)))

        const userDaysInChannel = leavingUsers.map(user => {
            const daysInChannel = differenceInCalendarDays(today, user.joinedIn)
            return {userId: user.userId, daysInChannel: daysInChannel}
        })

        const leaving = userDaysInChannel.filter(user => user.daysInChannel >= 7).map(user => user.userId)

        return [...userIdsWithAtLeastSevenDays, ...leaving]
    }

    async getLeavingUsersWithLessThanSevenDaysOfTimeInChannel(today: Date, leavingUsers: TelegramChatMember[]) {
        const userDaysInChannel = leavingUsers.map(user => {
            const daysInChannel = differenceInCalendarDays(today, user.joinedIn)
            return {userId: user.userId, daysInChannel: daysInChannel}
        })
        const leavingUsersWithLessThanSevenDays = userDaysInChannel.filter(user => user.daysInChannel < 7);
        return leavingUsersWithLessThanSevenDays.map(user => user.userId)
    }

    async getAllBotConversationStats() {
        return await this._statsDao.getAllBotConversationStats()
    }

    async clearAllBotConversationStats() {
        await this._statsDao.clearAllBotConversationStats()
    }

    async getTelegramUsersInfo(telegramIds: number[]) {
        const asyncActions = [];
        telegramIds.forEach(id => {
            asyncActions.push(this._airgramClient.getUserInfo(id))
        })
        return await Promise.all<UserInfo>(asyncActions)
    }
}