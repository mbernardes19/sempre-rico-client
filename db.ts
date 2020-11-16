import mysql from 'mysql2/promise';
import { Connection } from 'mysql2/promise';

let connection: Connection;

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

  export {handleDisconnect, connection}