import ReportDataGenerator from "./ReportDataGenerator";
import AirgramClient from "../model/AirgramClient";

export default class ReportGenerator {
    private _reportData: ReportDataGenerator;
    private _airgramClient: AirgramClient;
    private _channelId: number;
    private _channelIdToSend: number;

    constructor(airgramClient: AirgramClient, channelId: number, channelIdToSend: number) {
        this._airgramClient = airgramClient;
        this._reportData = new ReportDataGenerator(airgramClient, channelId);
        this._channelId = channelId;
        this._channelIdToSend = channelIdToSend;
    }

    async sendEnteringAndLeavingUsers() {
        const enteringUsers = await this._reportData.getEnteringUsers()
        const leavingUsers = await this._reportData.getLeavingUsers()
        const channelTitle = await this.getChannelTitle();
        const message = `${channelTitle} - Entraram: ${enteringUsers}, Saíram: ${leavingUsers}`;
        console.log(enteringUsers);
        const formattedChannelId = parseInt(`-100${this._channelIdToSend.toString()}`)
        await this._airgramClient.sendMessageToChannel(formattedChannelId, message)
    }

    async start() {
        await this._reportData.updateUserList();
    }

    private async getChannelTitle() {
        return await this._airgramClient.getChannelTitle(this._channelId)
    }
}