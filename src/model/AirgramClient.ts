import TelegramClient from "./TelegramClient";
import { Airgram, Auth } from "airgram";
import { TelegramChatMember } from "./Telegram";

export default class AirgramClient implements TelegramClient {
    private _airgram: Airgram;

    constructor(apiId: number, apiHash: string, libPath: string) {
        this._airgram = new Airgram({
            apiId: apiId,
            apiHash: apiHash,
            command: libPath,
            logVerbosityLevel: 0
          })

        this._airgram.use(new Auth({
            code: () => prompt('Insira por favor o código enviado pro seu Telegram:'),
            phoneNumber: () => prompt('Insira por favor seu telefone no formato internacional:')
        }))
    }

    async getChatMembersFromChannel(channelId: number): Promise<TelegramChatMember[]> {
        await this.findChats();
        const res = await this._airgram.api.getSupergroupMembers({supergroupId: channelId, limit: 100})
        if (res.response._ === 'chatMembers') {
            return res.response.members.map(member => ({ userId: member.userId }))
        } else {
            console.log(res.response.message)
        }
    }

    private async findChats() {
        const { response: chats } = await this._airgram.api.getChats({
            limit: 10,
            offsetChatId: 0,
            offsetOrder: '9223372036854775807'
        })
    }

    async sendMessageToChannel(channelId: number, message: string) {
        await this._airgram.api.sendMessage({chatId: channelId, inputMessageContent: {_: 'inputMessageText', text: { _: 'formattedText', text: message}}})
    }

    async getChannelTitle(channelId: number): Promise<string> {
        const res = await this._airgram.api.getChat({chatId: parseInt('-100'+channelId.toString())})
        if (res.response._ === 'chat') {
            return res.response.title
        } else {
            console.log(res.response.message);
        }
    }
}