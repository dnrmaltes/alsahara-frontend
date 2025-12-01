// src/controllers/boleta.controller.js
const store = require("../db/store");

// POST /api/boletas
exports.generar = (req, res) => {
  const { orderId, paymentId, total, items } = req.body;

  if (!orderId || !paymentId || !total) {
    return res.status(400).json({
      ok: false,
      error: "Faltan datos obligatorios para generar boleta",
    });
  }

  const boleta = {
    id: store.boletas.length + 1,
    orderId,
    paymentId,
    items: items || [],
    total: Number(total),
    fecha: new Date().toISOString(),
  };

  store.boletas.push(boleta);

  return res.status(201).json({
    ok: true,
    boleta,
  });
};