require('dotenv').config({path: './backend/.env'});
const sql = require('mssql')

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function testConnection() { 
    try {
    console.log('Connecting with config:', config);
    await sql.connect(config);
    console.log('SQL Server connection successful');
    await sql.close(); 
    } 
    catch (err) {
    console.error('SQL server connection failed', err);
    }
}

testConnection();