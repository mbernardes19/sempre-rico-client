import mysql from 'mysql2/promise';
import { Connection } from 'mysql2/promise';
import dotenv from 'dotenv';
import { MongoClient, Collection } from 'mongodb';
dotenv.config()

let connection: Connection;
let mongoStatsCollection: Collection; 

async function connectMongo() {
  const client = await MongoClient.connect(`${process.env.MONGO_CONNECTION_STRING}/${process.env.MONGO_DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true})
  const db = client.db('bot01')
  mongoStatsCollection = db.collection('stats')
}



async function handleDisconnect() {
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dateStrings: true
    })

    try {
      await connection.connect()
    } catch (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);       
    }
                                            
    connection.on('error', function(err) {
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
        handleDisconnect();                         
      } else {                                      
        throw err;                                  
      }
    });
  }


  export {handleDisconnect, connection, connectMongo, mongoStatsCollection}