import { Connection } from 'mysql2/promise';
import GenericDao from './GenericDao';
import StatsDto, {BotConversationStatsDto} from '../model/StatsDto';

export default class StatsDao extends GenericDao<StatsDto> {
    constructor(connection: Connection) {
        super(connection);
    }

    async findAll(): Promise<StatsDto[]> {
        const [res] = await this._connection.query<StatsDto[]>('SELECT * FROM Stats')
        return res;
    }

    async findOne(id: number): Promise<StatsDto> {
        const [res] = await this._connection.query<StatsDto[]>(`SELECT * FROM Stats WHERE id = ${id}`)
        return res[0];
    }

    async addBotConversationStats(botConversationStatsDto: BotConversationStatsDto): Promise<void> {
        const { type, userId, finished, reason } = botConversationStatsDto;
        await this._connection.query<BotConversationStatsDto[]>(`INSERT INTO Stats (type, userId, finished, reason) VALUES ('${type}', ${userId}, '${finished}', '${reason}')`)      
    }

    async getAllBotConversationStats(): Promise<BotConversationStatsDto[]> {
        const [res] = await this._connection.query<BotConversationStatsDto[]>(`SELECT * FROM Stats where type='BOT_CONVERSATION'`)
        return res;
    }

    async clearAllBotConversationStats(): Promise<void> {
        const [res] = await this._connection.query<BotConversationStatsDto[]>(`DELETE FROM Stats where type='BOT_CONVERSATION'`)
    }


}


