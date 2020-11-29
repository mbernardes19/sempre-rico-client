import express from 'express'
import { handleDisconnect, connection } from './db';
import AirgramClient from './src/model/AirgramClient';
import UserMapper from './src/mappers/UserMapper';
import ReportGenerator from './src/services/ReportGenerator';
import ScheduleService from './src/services/ScheduleService';
import FreeUserRepository from './src/repositories/FreeUserRepository';
import FreeUserDao from './src/daos/FreeUserDao';
import bodyParser from 'body-parser';
import StatsDao from './src/daos/StatsDao';

const delay = (n) => {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
};

const PORT = process.env.PORT || 3030
const app = express();
app.use(bodyParser.json());


(async () => {
  await handleDisconnect()
  const scheduleService = new ScheduleService();
  const airgramClient = new AirgramClient(1485371, "662c661df7d0b41601f6cb8ae2ef35d6", "./libtdjson.dylib")
  const userDao = new FreeUserDao(connection);
  const statsDao = new StatsDao(connection);

  const userMapper = new UserMapper();
  const freeUserRepository = new FreeUserRepository(userDao, userMapper)
  const reportGenerator = new ReportGenerator(airgramClient, freeUserRepository, statsDao, 1386340547, 1386340547);
  console.log('START')

app.post('/bot', async (req, res) => {
  console.log(req.body);
  await statsDao.addBotConversationStats({
    constructor: { name: 'RowDataPacket' },
    id: 0,
    type: 'BOT_CONVERSATION',
    userId: req.body.chatId,
    finished: req.body.finished ? 'S' : 'N',
    reason: req.body.reason
  })
})
  await reportGenerator.start();
  await delay(30000);
  await reportGenerator.sendReport();
  // await reportGenerator.sendEnteringAndLeavingUsers()
  // await reportGenerator.sendUsersWithAtLeastSevenDaysInChannel()
  // await reportGenerator.sendLeavingUsersWithLessThanSevenDaysInChannel()
  // scheduleService.schedule('0 0 * * *', async () => {
  //   await reportGenerator.start();
  //   console.log('COMECOU')
  // })
  // scheduleService.schedule('59 23 * * *', async () => {
  //   await reportGenerator.sendEnteringAndLeavingUsers();
  //   console.log('FINALIZOU')
  // })
  console.log('ENVIADOS')
})()




app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`))