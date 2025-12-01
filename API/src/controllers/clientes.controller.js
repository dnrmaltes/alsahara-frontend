const store = require("../db/store");

exports.getAll = (req, res) => {
  return res.json(store.clientes);
};

exports.create = (req, res) => {
  const { name, email, phone, rut, address, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Nombre y email son obligatorios." });
  }

  const id = store.clientes.length + 1;

  const cli = { id, name, email, phone, rut, address, status: status || "ACTIVE" };
  store.clientes.push(cli);

  return res.status(201).json(cli);
};

exports.update = (req, res) => {
  const id = Number(req.params.id);
  const idx = store.clientes.findIndex(c => c.id === id);

  if (idx < 0) {
    return res.status(404).json({ message: "Cliente no existe." });
  }

  store.clientes[idx] = { ...store.clientes[idx], ...req.body };

  return res.json(store.clientes[idx]);
};

exports.remove = (req, res) => {
  const id = Number(req.params.id);
  const before = store.clientes.length;

  store.clientes = store.clientes.filter(c => c.id !== id);

  if (store.clientes.length === before) {
    return res.status(404).json({ message: "Cliente no existe." });
  }

  return res.json({ ok: true });
};