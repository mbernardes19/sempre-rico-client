import ReportDataGenerator from "../src/services/ReportDataGenerator";
import UserRepository from "../src/repositories/UserRepository";
import UserDao from "../src/daos/UserDao";
import { connection } from '../db';
import UserMapper from "../src/mappers/UserMapper";
import AirgramClient from "../src/model/AirgramClient";

jest.mock('airgram')
jest.mock('../src/model/AirgramClient')

let reportDataGenerator: ReportDataGenerator;
const dao = new UserDao(connection);
const mapper = new UserMapper();
const mockedAirgramClient = new AirgramClient(1485371, "662c661df7d0b41601f6cb8ae2ef35d6", "./libtdjson.dylib") as jest.Mocked<AirgramClient>

beforeEach(() => {
    reportDataGenerator = new ReportDataGenerator(mockedAirgramClient, 123)
    jest.resetAllMocks();
})

describe('Report Data Generator', () => {
    it('should return the new users when there are any', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}, {userId:4}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getEnteringUsers()
        expect(res).toEqual([ 4 ])
    })
    it('should return an empty array there are only leaving users', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}, {userId:4}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getEnteringUsers()
        expect(res).toEqual([])
    })
    it('should return an empty array there is no change on users list', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getEnteringUsers()
        expect(res).toEqual([])
    })
    it('should return the leaving users when there are any', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}, {userId: 4}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getLeavingUsers()
        expect(res).toEqual([ 2, 4 ])
    })
    it('should return an empty array there are no leaving users', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId: 5}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getLeavingUsers()
        expect(res).toEqual([])
    })
    it('should return an empty array there is no change on users list', async () => {
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        mockedAirgramClient.getChatMembersFromChannel.mockImplementationOnce(() => Promise.resolve([{userId:1}, {userId:2}, {userId:3}]))
        await reportDataGenerator.updateUserList()
        const res = await reportDataGenerator.getLeavingUsers()
        expect(res).toEqual([])
    })
});