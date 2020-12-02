import { Collection } from 'mongodb';
import Dao from './Dao';
import StatsDto, {BotConversationStatsDto} from '../model/StatsDto';


export default class StatsDao implements Dao<StatsDto> {
    private _collection: Collection<StatsDto|BotConversationStatsDto>;
    constructor(collection: Collection) {
        this._collection = collection;
    }


    async findAll(): Promise<StatsDto[]> {
        return await this._collection.find().toArray()
    }

    async findOne(id: number): Promise<StatsDto> {
        return await this._collection.findOne({id: id})
    }

    async addBotConversationStats(botConversationStatsDto: BotConversationStatsDto): Promise<void> {
        await this._collection.insertOne(botConversationStatsDto)
    }

    async getAllBotConversationStats(): Promise<BotConversationStatsDto[]> {
        return await this._collection.find().toArray() as BotConversationStatsDto[]
    }

    async clearAllBotConversationStats(): Promise<void> {
        await this._collection.deleteMany({type: 'BOT_CONVERSATION'})
    }


}


