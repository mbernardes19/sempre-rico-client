import express from 'express'
import { handleDisconnect, connection } from './db';
import AirgramClient from './model/AirgramClient';
import UserMapper from './mappers/UserMapper';
import ReportGenerator from './services/ReportGenerator';
import ScheduleService from './services/ScheduleService';
import FreeUserRepository from './repositories/FreeUserRepository';
import FreeUserDao from './daos/FreeUserDao';
import bodyParser from 'body-parser';
import StatsDao from './daos/StatsDao';

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
  const airgramClient = new AirgramClient(1485371, "662c661df7d0b41601f6cb8ae2ef35d6", "./libtdjson.so")
  const userDao = new FreeUserDao(connection);
  const statsDao = new StatsDao(connection);

  const userMapper = new UserMapper();
  const freeUserRepository = new FreeUserRepository(userDao, userMapper)
  const reportGeneratorRicoVidente = new ReportGenerator(airgramClient, freeUserRepository, statsDao, parseInt(process.env.ID_CANAL_RICO_VIDENTE), 1145065581);
  const reportGeneratorSinaisRicos = new ReportGenerator(airgramClient, freeUserRepository, statsDao, parseInt(process.env.ID_CANAL_SINAIS_RICOS), 1145065581);
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
  await reportGeneratorRicoVidente.start();
  await reportGeneratorSinaisRicos.start();
  await delay(30000);
  await reportGeneratorRicoVidente.sendReport();
  await reportGeneratorSinaisRicos.sendReport();

  scheduleService.schedule('0 0 * * *', async () => {
    try {
      await reportGeneratorRicoVidente.start();
      await reportGeneratorSinaisRicos.start();
      console.log('COMECOU')
    } catch(err) {
      console.log(err)
    }
  })
  scheduleService.schedule('59 23 * * *', async () => {
    try {
      await reportGeneratorRicoVidente.sendReport();
      await reportGeneratorSinaisRicos.sendReport();
    } catch (err) {
      console.log(err)
    }
    console.log('FINALIZOU')
  })
  console.log('ENVIADOS')
})()




app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`))