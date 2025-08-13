module.exports = function errorHandler(err, _req, res, _next){
    console.error(err);
    res.status(500).json({ error: 'Server error', details: String(err.message || err) });
}