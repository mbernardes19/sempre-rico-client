import { Airgram, Auth, prompt } from 'airgram'
import { application } from 'express'
import { handleDisconnect, connection } from './db';
import AirgramClient from './src/model/AirgramClient';
import ReportDataGenerator from './src/services/ReportDataGenerator';
import UserRepository from './src/repositories/UserRepository';
import UserDao from './src/daos/UserDao';
import UserMapper from './src/mappers/UserMapper';
import ReportGenerator from './src/services/ReportGenerator';

const delay = (n) => {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
};

(async () => {
  await handleDisconnect();
  const airgramClient = new AirgramClient(1485371, "662c661df7d0b41601f6cb8ae2ef35d6", "./libtdjson.dylib")
  const reportGenerator = new ReportGenerator(airgramClient, 1386340547, 1386340547);
  await reportGenerator.start();
  console.log('COMECOU')
  await delay(60000);
  await reportGenerator.sendEnteringAndLeavingUsers();
  console.log('FINALIZOU')
})()

const PORT = process.env.PORT || 3030
const app = application
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`))