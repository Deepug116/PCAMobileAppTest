// backend/routes/assetsNoMaintenance.js
const express = require('express');
const { sql, config } = require('../db/sql');

const router = express.Router();

/**
 * GET /api/v1/assets/no-maintenance
 * Optional query params:
 *   since=YYYY-MM-DD  -> filter assets that have had NO maintenance after this date
 *   q=...             -> search (fam, tag, description)
 *   page=1&pageSize=50  -> pagination
 */
router.get('/no-maintenance', async (req, res, next) => {
  const { q = '', page = '1', pageSize = '50', since: sinceStr } = req.query;

  try {
    const pool = await sql.connect(config);

    // if no 'since' provided, pull the most recent date from dbo.tblInventoryCycle
    let since = sinceStr;
    if (!since) {
      const rsDate = await pool.request().query(`
        SELECT TOP 1 InventoryDateIC
        FROM dbo.tblInventoryCycle
        ORDER BY InventoryDateIC DESC
      `);
      if (!rsDate.recordset.length) {
        return res.status(500).json({ error: 'No InventoryCycle rows found to infer "since" date.' });
      }
      since = rsDate.recordset[0].InventoryDateIC;
    }

    const like = `%${q}%`;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 200);
    const offset = (pageNum - 1) * size;

    // shared WHERE clause: assets that have NOT had maintenance AFTER @since
    // dbo.tblAssets (a) vs dbo.tblMaintenance (m)
    const whereClause = `
      WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.tblMaintenance m
        WHERE m.AssetIDMN = a.AssetIDAS
          AND m.MaintDateMN > @since
      )
      AND (
        @like = '' OR
        a.FAMNumAS LIKE @like OR
        a.FATagNumAS LIKE @like OR
        a.POCommentsAS LIKE @like
      )
    `;

    // 1) total count
    const totalRs = await pool.request()
      .input('since', sql.DateTime, new Date(since))
      .input('like',  sql.NVarChar, like)
      .query(`
        SELECT COUNT(*) AS total
        FROM dbo.tblAssets a
        ${whereClause}
      `);

    const total = totalRs.recordset[0]?.total ?? 0;

    // 2) page of rows
    const pageRs = await pool.request()
      .input('since', sql.DateTime, new Date(since))
      .input('like',  sql.NVarChar, like)
      .input('offset', sql.Int, offset)
      .input('limit',  sql.Int, size)
      .query(`
        SELECT
          a.AssetIDAS     AS id,
          a.FAMNumAS      AS fam,
          a.FATagNumAS    AS tag,
          a.POCommentsAS  AS description,
          a.MaintTypeAS   AS maintType
        FROM dbo.tblAssets a
        ${whereClause}
        ORDER BY a.LastUpdatedAS DESC, a.AssetIDAS ASC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
      `);

    res.json({
      total,
      page: pageNum,
      pageSize: size,
      data: pageRs.recordset,
      since: new Date(since).toISOString(),
    });
  } catch (err) {
    console.error('[no-maintenance] route failed:', err);
    res.status(500).json({
      error: 'Failed to fetch assets with no maintenance since date',
      details: err?.message || String(err),
    });
  }
});

module.exports = router;