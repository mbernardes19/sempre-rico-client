import MongoClient, { Collection } from 'mongodb';
import StatsDao from '../../src/daos/StatsDao';
import StatsDto, { BotConversationStatsDto } from '../../src/model/StatsDto';
const mongoUrl = 'mongodb+srv://root:zdQkSwwTupMYLNjm@cluster0.p06o7.mongodb.net/bot01-test?retryWrites=true&w=majority'

let statsDao: StatsDao;
let collection: Collection<StatsDto|BotConversationStatsDto>
let client: MongoClient.MongoClient;

beforeAll(async () => {
    client = await MongoClient.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = client.db('bot01-test')
    collection = db.collection('stats')
    statsDao = new StatsDao(collection);
})

beforeEach(async () => {
    await statsDao.clearAllBotConversationStats();
})

afterAll(async () => {
    await statsDao.clearAllBotConversationStats();
    await client.close()
})

describe('Stats Dao Integration', () => {
    it('connects', () => {
        expect(statsDao).toBeTruthy()
        expect(collection.collectionName).toBe('stats')
    })

    it('adds a Bot Conversation Stats to DB', async () => {
        const botConversationStat: BotConversationStatsDto = {
            type: 'BOT_CONVERSATION',
            userId: 123,
            reason: 'test',
            finished: 'N'
        }
        await statsDao.addBotConversationStats(botConversationStat)
        const response = await collection.findOne({userId: 123})
        expect(response.type).toBe('BOT_CONVERSATION')
        expect((response as BotConversationStatsDto).finished).toBe('N')
        expect((response as BotConversationStatsDto).reason).toBe('test')
        expect((response as BotConversationStatsDto).userId).toBe(123)
    })

    it('gets all Bot Conversation Stats', async () => {
        const botConversationStat: BotConversationStatsDto = {
            type: 'BOT_CONVERSATION',
            userId: 123,
            reason: 'test',
            finished: 'N'
        }
        const botConversationStat2 = {...botConversationStat, userId: 345}
        const botConversationStat3 = {...botConversationStat, userId: 567}

        await statsDao.addBotConversationStats(botConversationStat)
        await statsDao.addBotConversationStats(botConversationStat2)
        await statsDao.addBotConversationStats(botConversationStat3)

        const conversationStats = await statsDao.getAllBotConversationStats()
        expect(conversationStats.length).toBe(3)
        expect(conversationStats[0].userId).toBe(123)
        expect(conversationStats[1].userId).toBe(345)
        expect(conversationStats[2].userId).toBe(567)
    })

    it('removes all Bot Conversation Stats from DB', async () => {
        await statsDao.clearAllBotConversationStats()
        const response = await collection.find().toArray()
        expect(response.length).toBe(0)
    })
})