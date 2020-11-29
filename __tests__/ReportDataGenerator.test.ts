import ReportDataGenerator from "../src/services/ReportDataGenerator";
import { connection } from '../db';
import UserMapper from "../src/mappers/UserMapper";
import AirgramClient from "../src/model/AirgramClient";
import FreeUserRepository from "../src/repositories/FreeUserRepository";
import FreeUserDao from "../src/daos/FreeUserDao";
import StatsDao from "../src/daos/StatsDao";
import { TelegramChatMember } from "../src/model/Telegram";

jest.mock('airgram')
jest.mock('../src/model/AirgramClient')
jest.mock('../src/daos/FreeUserDao')
jest.mock('../src/repositories/FreeUserRepository')

let reportDataGenerator: ReportDataGenerator;
const mockedDao = new FreeUserDao(connection) as jest.Mocked<FreeUserDao>;
const mockedStatsDao = new StatsDao(connection) as jest.Mocked<StatsDao>;
const mapper = new UserMapper();
const mockedAirgramClient = new AirgramClient(1485371, "662c661df7d0b41601f6cb8ae2ef35d6", "./libtdjson.dylib") as jest.Mocked<AirgramClient>
const mockedFreeUserRepository = new FreeUserRepository(mockedDao, mapper) as jest.Mocked<FreeUserRepository>

beforeEach(() => {
    reportDataGenerator = new ReportDataGenerator(mockedAirgramClient, mockedFreeUserRepository, mockedStatsDao, 123)
})

describe('Report Data Generator', () => {
    it('only gets free users from channel', async () => {
        mockedFreeUserRepository.getAllUsersId.mockImplementationOnce(() => Promise.resolve([1,2]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        const users = await reportDataGenerator.getUpdatedUserList()
        expect(users).toStrictEqual([{userId:1}, {userId:2}])
    })
    it('returns the new users when there are any', async () => {
        mockedFreeUserRepository.getAllUsersId.mockImplementationOnce(() => Promise.resolve([1,2,3]))
        mockedFreeUserRepository.getAllUsersId.mockImplementationOnce(() => Promise.resolve([1,2,3,4]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}, {userId:4}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getEnteringUsers()
        expect(res).toEqual([ {userId: 4} ])
    })
    it('returns an empty array when there are only leaving users', async () => {
        mockedFreeUserRepository.getAllUsersId.mockImplementation(() => Promise.resolve([1,2,3,4,5]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}, {userId:4}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getEnteringUsers()
        expect(res).toEqual([])
    })
    it('returns an empty array there is no change on users list', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getEnteringUsers()
        expect(res).toEqual([])
    })
    it('returns the leaving users when there are any', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}, {userId: 4}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getLeavingUsers()
        expect(res).toEqual([ {userId: 2}, {userId: 4} ])
    })
    it('returns an empty array when there are no leaving users', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId: 5}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getLeavingUsers()
        expect(res).toEqual([])
    })
    it('returns an empty array when there is no change on users list', async () => {
        mockedFreeUserRepository.getAllUsersId.mockImplementation(() => Promise.resolve([1,2,3]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getLeavingUsers()
        expect(res).toEqual([])
    })

    it('returns users that left in less than seven days from the channel', async () => {
        const leavingUsers: TelegramChatMember[] = [
            {userId: 1, joinedIn: new Date(2020, 10, 26)},
            {userId: 2, joinedIn: new Date(2020, 10, 10)},
            {userId: 3, joinedIn: new Date(2020, 10, 22)},
            {userId: 4, joinedIn: new Date(2020, 10, 23)},
            {userId: 5, joinedIn: new Date(2020, 10, 24)},
        ]

        const todayMock = new Date(2020, 10, 29);
        const userIds = await reportDataGenerator.getLeavingUsersWithLessThanSevenDaysOfTimeInChannel(todayMock,leavingUsers);
        expect(userIds).toStrictEqual([1, 4, 5])
    })

    it('returns users that have seven or more days in channel', async () => {
        const leavingUsers: TelegramChatMember[] = [
            {userId: 1, joinedIn: new Date(2020, 10, 26)},
            {userId: 2, joinedIn: new Date(2020, 10, 10)},
            {userId: 3, joinedIn: new Date(2020, 10, 5)},
            {userId: 4, joinedIn: new Date(2020, 10, 28)},
            {userId: 5, joinedIn: new Date(2020, 10, 24)},
        ]

        jest.spyOn(reportDataGenerator, 'getAllUsersTimeInChannel')
            .mockImplementation(() => Promise.resolve(
                [
                    {userId: 6, daysInChannel: 2},
                    {userId: 7, daysInChannel: 7},
                    {userId: 8, daysInChannel: 10},
                    {userId: 9, daysInChannel: 6},
                ]
            ))
        const today = new Date(2020, 10, 29);
        
        const userIds = await reportDataGenerator.getUsersWithAtLeastSevenDaysOfTimeInChannel(today, leavingUsers)
        expect(userIds).toStrictEqual([7, 8, 2, 3])
    })
});