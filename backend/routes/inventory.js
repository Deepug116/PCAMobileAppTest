// backend/routes/inventory.js
const express = require('express');
const router = express.Router();

// Use the shared MSSQL client + config
// Adjust the path below if your config file lives elsewhere
const { sql, config } = require('../db/sql');

// GET /api/v1/inventory/latest
router.get('/latest', async (_req, res, next) => {
  let pool;
  try {
    pool = await sql.connect(config);

    const rs = await pool.request().query(`
      SELECT TOP 1
        InventoryDateIC,
        CycleIDIC
      FROM dbo.tblInventoryCycle
      ORDER BY InventoryDateIC DESC;
    `);

    if (!rs.recordset.length) {
      return res.status(404).json({ message: 'No cycle rows' });
    }

    const row = rs.recordset[0];
    const cycleId = Number(row.CycleIDIC);
    const cycleLabel = cycleId % 2 === 0 ? 'Even' : 'Odd';
    const inventoryDate = new Date(row.InventoryDateIC).toISOString().slice(0, 10);

    res.json({
      inventoryDate: row.InventoryDateIC,
      cycleId,
      cycleLabel,
    });
  } catch (err) {
    next(err); 
  } finally {
    if (pool) await pool.close();
  }
});

module.exports = router;