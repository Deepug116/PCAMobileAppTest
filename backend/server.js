require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

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

console.log('CONFIG:', config);

app.get('/', (req, res) => {
  res.send('✅ Backend API is running');
});

app.get('/assets', async (req, res) => {
  try {
    console.log("Connecting with config:" , config);
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM dbo.tblAssets');

    const cleanedData = result.recordset.map(row =>({
      id: row.AssetID,
      description: row.CommentsAS?.trim() || 'No description',
      imagePath: row.ImageAS ? row.ImageAS.replace(/^\\\\|^\\|G:\\\\|G:\\/g, ''): null,
      lastUpdated: row.LastUpdatedAS ? new Date(row.LastUpdatedAS).toLocaleDateString(): 'N/A',
      }));

      res.json(cleanedData);
      await pool.close();

    
  } catch (err) {
    console.error('SQL error:', err); 
    res.status(500).send('Database query failed');
  }
});

app.listen(3000, () => {
  console.log('✅ API running at http://localhost:3000');
});


