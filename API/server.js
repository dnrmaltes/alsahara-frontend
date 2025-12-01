const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// IMPORTA RUTAS (archivos en src/routes/*.routes.js)
const authRoutes     = require("./src/routes/auth.routes");
const productsRoutes = require("./src/routes/products.routes");
const orderRoutes    = require("./src/routes/order.routes");
const boletaRoutes   = require("./src/routes/boleta.routes");
const reportesRoutes = require("./src/routes/reportes.routes");
const clientesRoutes = require("./src/routes/clientes.routes");
app.use("/api/clientes", clientesRoutes);

// Validador para detectar errores de exportación
function assertIsRouter(r, name) {
  if (!r || typeof r !== "function" || !r.stack) {
    throw new Error(`❌ ${name} no exporta un Router de Express. Revisa module.exports = router;`);
  }
}
assertIsRouter(authRoutes, "auth.routes");
assertIsRouter(productsRoutes, "products.routes");
assertIsRouter(orderRoutes, "order.routes");
assertIsRouter(boletaRoutes, "boleta.routes");
assertIsRouter(reportesRoutes, "reportes.routes");

// MONTA RUTAS
app.use("/api/auth",     authRoutes);
app.use("/api/catalogo", productsRoutes);
app.use("/api/pedidos",  orderRoutes);
app.use("/api/boletas",  boletaRoutes);
app.use("/api/reportes", reportesRoutes);

// Healthcheck
app.get("/", (req, res) => res.json({ ok: true, api: "Al Sahara" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));