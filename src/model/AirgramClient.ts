import TelegramClient from "./TelegramClient";
import { Airgram, Auth, ChatMember, prompt } from "airgram";
import { TelegramChatMember } from "./Telegram";
import { fromUnixTime } from 'date-fns';
import Logger from "../services/Logger";


export type UserInfo = {
    fullName: string,
    username: string       
}

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
            return res.response.members.map(member => {
                Logger.info(member.userId)
                return { userId: member.userId, joinedIn: member.joinedChatDate !== 0 ? fromUnixTime(member.joinedChatDate) : null }
            })
        } else {
            Logger.info(res.response.message)
        }
    }

    private async findChats() {
        const { response: chats } = await this._airgram.api.getChats({
            limit: 10,
            offsetChatId: 0,
            offsetOrder: '9223372036854775807'
        })
    }

    async sendMesageToUser(userId: number, message: string) {
        await this._airgram.api.sendMessage({chatId: userId, inputMessageContent: {_: 'inputMessageText', text: { _: 'formattedText', text: message}}})
    }

    async sendMessageToChannel(channelId: number, message: string) {
        await this._airgram.api.sendMessage({chatId: channelId, inputMessageContent: {_: 'inputMessageText', text: { _: 'formattedText', text: message}}})
    }

    async getChannelTitle(channelId: number): Promise<string> {
        const res = await this._airgram.api.getChat({chatId: parseInt('-100'+channelId.toString())})
        if (res.response._ === 'chat') {
            return res.response.title
        } else {
            Logger.info(res.response.message);
        }
    }

    async getChatMember(userId: number, chatId: number): Promise<TelegramChatMember> {
        const res = await this._airgram.api.getChatMember({chatId: chatId, userId: userId})
        if (res.response._ === 'chatMember') {
            return { userId: res.response.userId, joinedIn: res.response.joinedChatDate !== 0 ? fromUnixTime(res.response.joinedChatDate) : null}
        }
    }

    async getUserInfo(userId: number): Promise<UserInfo> {
        const res = await this._airgram.api.getUser({userId})
        if (res.response._ === 'user') {
            return { fullName: res.response.firstName + " " + res.response.lastName, username: res.response.username }
        }
    }
}