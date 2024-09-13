const oracledb = require('oracledb');
const dotenv = require('dotenv');

dotenv.config(); 

oracledb.initOracleClient({ libDir: 'C:/instantclient-basic-windows.x64-23.4.0.24.05/instantclient_23_4' });

let connection;

async function connectToDatabase() {
  // if already established
  if (connection) {
    return connection; 
  }

  try {
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: `${process.env.HOST}:${process.env.DBPORT}/${process.env.SID}`
    });

    console.log("Connected to database:", process.env.DATABASE);
    return connection; 
  } catch (err) {
    console.error("Error connecting to database:", err.message);
    console.error("Error details:", err);
    throw err;
  }
}

connectToDatabase();

module.exports = connectToDatabase;
