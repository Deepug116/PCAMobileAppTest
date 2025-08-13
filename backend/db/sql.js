const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE || process.env.DB_NAME, // support either name
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === 'true',
    trustServerCertificate: String(process.env.DB_TRUST_CERT).toLowerCase() === 'true',
  },
};

// TEMP sanity log (mask password)
console.log('DB CONFIG:', {
  user: config.user,
  server: config.server,
  database: config.database,
  port: config.port,
  options: config.options,
});

module.exports = { sql, config };