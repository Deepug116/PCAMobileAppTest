const express = require("express");
const cors = require("cors");
require("dotenv").config({path: __dirname + "/.env"});

const assetsRouter = require("./routes/assets");
const errorHandler = require("./middleware/error");
const inventoryRouter = require("./routes/inventory");
const noMaintenanceRouter = require("./routes/assetsNoMaintenance");

const app = express();
app.use(cors());
app.use(express.json());

// health checks
app.get("/health", (_req, res) => res.json({ ok: true }));

// versioned API prefix
app.use("/api/v1/assets", assetsRouter);

// error handler last
app.use(errorHandler);

app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/assets", noMaintenanceRouter);

const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});