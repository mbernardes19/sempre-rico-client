import ReportDataGenerator from "./ReportDataGenerator";
import AirgramClient from "../model/AirgramClient";
import FreeUserRepository from "../repositories/FreeUserRepository";
import StatsDao from "../daos/StatsDao";

export default class ReportGenerator {
    private _reportData: ReportDataGenerator;
    private _airgramClient: AirgramClient;
    private _channelId: number;
    private _chatIdToSend: number;

    constructor(airgramClient: AirgramClient, freeUserRepository: FreeUserRepository, statsDao: StatsDao, channelId: number, chatIdToSend: number) {
        this._airgramClient = airgramClient;
        this._reportData = new ReportDataGenerator(airgramClient, freeUserRepository, statsDao, channelId);
        this._channelId = channelId;
        this._chatIdToSend = chatIdToSend;
    }

    private async enteringUsers() {
        const enteringUsers = await this._reportData.getEnteringUsers()
        return `Entraram: ${enteringUsers.length} usuários (${enteringUsers.map(user => user.userId.toString() + ", ")})`;
    }

    private async leavingUsers() {
        const leavingUsers = await this._reportData.getLeavingUsers()
        return `Saíram: ${leavingUsers.length} usuários (${leavingUsers.map(user => user.userId.toString() + ", ")})`;
    }

    private async usersWithAtLeastSevenDaysInChannel() {
        const leavingUsers = await this._reportData.getLeavingUsers()
        const users = await this._reportData.getUsersWithAtLeastSevenDaysOfTimeInChannel(new Date(), leavingUsers)
        return `Usuários com 7 ou mais dias no canal: ${users.length} (${users.map(user => user.toString() + ", ")})`;
    }

    private async leavingUsersWithLessThanSevenDaysInChannel() {
        const leavingUsers = await this._reportData.getLeavingUsers()
        const users = await this._reportData.getLeavingUsersWithLessThanSevenDaysOfTimeInChannel(new Date(), leavingUsers)
        return `Usuário que saíram com menos de 7 dias do canal: ${users.length} (${users.map(user => user.toString() + ", ")})`;
    }

    private async botConversationsStats() {
        const botConversationStats = await this._reportData.getAllBotConversationStats()
        return `Usuários que desistiram da conversa com o bot: ${botConversationStats.length} (${botConversationStats.map(c => c.reason !== 'ERROR' && c.reason !== 'SUCCESS' ? c.userId.toString() + ", " : '')})`;
    }

    async sendReport() {
        const channelTitle = await this.getChannelTitle();
        const report = `RELATÓRIO DE USUÁRIOS GRATUITOS ${channelTitle.toUpperCase()} - ${new Date().toLocaleDateString()}

${await this.enteringUsers()}
${await this.leavingUsers()}
${await this.usersWithAtLeastSevenDaysInChannel()}
${await this.leavingUsersWithLessThanSevenDaysInChannel()}
${await this.botConversationsStats()}
        `
        await this._airgramClient.sendMesageToUser(this._chatIdToSend, report)
    }

    async start() {
        await this._reportData.updateUserList();
    }

    private async getChannelTitle() {
        return await this._airgramClient.getChannelTitle(this._channelId)
    }
}