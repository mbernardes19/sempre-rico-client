import express from 'express'
import AirgramClient from './model/AirgramClient';
import UserMapper from './mappers/UserMapper';
import ReportGenerator from './services/ReportGenerator';
import ScheduleService from './services/ScheduleService';
import FreeUserRepository from './repositories/FreeUserRepository';
import FreeUserDao from './daos/FreeUserDao';
import bodyParser from 'body-parser';
import StatsDao from './daos/StatsDao';
import { mongoStatsCollection, connectMongo } from './db';
import Logger from './services/Logger';

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
  await connectMongo();
  const scheduleService = new ScheduleService();
  const airgramClient = new AirgramClient(1485371, "662c661df7d0b41601f6cb8ae2ef35d6", "./libtdjson.so")
  const userDao = new FreeUserDao();
  const statsDao = new StatsDao(mongoStatsCollection);

  const userMapper = new UserMapper();
  const freeUserRepository = new FreeUserRepository(userDao, userMapper)
  const reportGeneratorRicoVidente = new ReportGenerator(airgramClient, freeUserRepository, statsDao, parseInt(process.env.ID_CANAL_RICO_VIDENTE), [1145065581, 923769783]);
  const reportGeneratorSinaisRicos = new ReportGenerator(airgramClient, freeUserRepository, statsDao, parseInt(process.env.ID_CANAL_SINAIS_RICOS), [1145065581, 923769783]);
  Logger.info('START')

app.post('/bot', async (req, res) => {
  Logger.info(req.body);
  await statsDao.addBotConversationStats({
    type: 'BOT_CONVERSATION',
    userId: req.body.chatId,
    finished: req.body.finished ? 'S' : 'N',
    reason: req.body.reason
  })
  res.status(200).send()
})

  // await reportGeneratorRicoVidente.start();
  // await reportGeneratorSinaisRicos.start();
  // await delay(30000);
  // await reportGeneratorRicoVidente.sendReport();
  // await reportGeneratorSinaisRicos.sendReport();

  try {
    await reportGeneratorRicoVidente.start();
    await reportGeneratorSinaisRicos.start();
    Logger.info('COMECOU')
  } catch(err) {
    Logger.error('ERRO', err)
  }

  scheduleService.schedule('0 0 * * 1-5', async () => {
    try {
      await reportGeneratorRicoVidente.start();
      await reportGeneratorSinaisRicos.start();
      Logger.info('COMECOU')
    } catch(err) {
      Logger.error('ERRO', err)
    }
  })
  scheduleService.schedule('59 23 * * 1-5', async () => {
    try {
      await reportGeneratorRicoVidente.sendReport();
      await reportGeneratorSinaisRicos.sendReport();
    } catch (err) {
      Logger.error('ERRO', err)
    }
    Logger.info('FINALIZOU')
  })
  Logger.info('ENVIADOS')
})()




app.listen(PORT, () => Logger.info(`Rodando na porta ${PORT}`))