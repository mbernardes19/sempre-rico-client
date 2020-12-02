export default interface StatsDto {
    id?: number,
    type: string
}

export interface BotConversationStatsDto extends StatsDto {
    type: 'BOT_CONVERSATION'
    userId: number,
    finished: string,
    reason: string
}