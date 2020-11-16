import { TelegramChatMember } from "./Telegram";

export default interface TelegramClient {
    getChatMembersFromChannel(channelId: number): Promise<TelegramChatMember[]>
}