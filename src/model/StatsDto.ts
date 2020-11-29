import { RowDataPacket } from "mysql2";

export default interface StatsDto extends RowDataPacket {
    id: number,
    type: string
}

export interface BotConversationStatsDto extends StatsDto {
    type: 'BOT_CONVERSATION'
    userId: number,
    finished: string,
    reason: string
}