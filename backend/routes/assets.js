// backend/routes/assets.js
const express = require('express');
const router = express.Router();
const { sql, config } = require('../db/sql');

router.get('/', async (req, res, next) => {
  const { q = '', page = '1', pageSize = '50' } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const sizeNum = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 200);
  const offset = (pageNum - 1) * sizeNum;

  // build WHERE with parameters
  const hasQ = String(q).trim().length > 0;
  const where = hasQ
    ? `WHERE (FAMNumAS LIKE @q OR FATagNumAS LIKE @q OR POCommentsAS LIKE @q)`
    : '';

  const totalSql = `
    SELECT COUNT(*) AS total
    FROM dbo.tblAssets
    ${where};
  `;
  const pageSql = `
    SELECT
      AssetIDAS      AS id,
      FAMNumAS       AS fam,
      FATagNumAS     AS tag,
      POCommentsAS   AS description,
      MaintTypeAS    AS maintType,
      LastUpdatedAS  AS lastUpdated
    FROM dbo.tblAssets
    ${where}
    ORDER BY LastUpdatedAS DESC, AssetIDAS ASC
    OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY;
  `;

  let pool;
  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();                       // <-- important

    const reqTotal = pool.request();
    const reqPage  = pool.request();

    if (hasQ) {
      const like = `%${q}%`;
      reqTotal.input('q', sql.NVarChar(255), like);
      reqPage.input('q', sql.NVarChar(255), like);
    }
    reqPage.input('offset', sql.Int, offset);
    reqPage.input('size', sql.Int, sizeNum);

    const [totalRs, pageRs] = await Promise.all([
      reqTotal.query(totalSql),
      reqPage.query(pageSql),
    ]);

    res.json({
      total: totalRs.recordset[0]?.total ?? 0,
      page: pageNum,
      pageSize: sizeNum,
      data: pageRs.recordset.map(r => ({
        id: r.id,
        fam: r.fam ?? null,
        tag: r.tag ?? null,
        description: r.description ?? 'No description',
        maintType: r.maintType ?? null,
        lastUpdated: r.lastUpdated,
      })),
    });
  } catch (err) {
    console.error('[ERROR] /assets route failed:', err?.message);
    res.status(500).json({ error: 'Failed to fetch assets', details: err?.message });
  } finally {
    if (pool) pool.close();                     // <-- always close
  }
});

module.exports = router;
