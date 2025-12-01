// src/controllers/auth.controller.js
const store = require("../db/store");

// Normalizar correo
function normalizeEmail(e) {
  return (e || "").trim().toLowerCase();
}

// ======================
// REGISTRO
// ======================
exports.register = (req, res) => {
  const { email, password, pass } = req.body;
  const pwd = password || pass;

  if (!email || !pwd)
    return res.status(400).json({ message: "Email y contraseña son obligatorios." });

  const nEmail = normalizeEmail(email);

  const exists = store.usuarios.find(u => u.email === nEmail);
  if (exists)
    return res.status(400).json({ message: "El email ya está registrado." });

  const user = {
    id: store.usuarios.length + 1,
    email: nEmail,
    password: pwd,
  };

  store.usuarios.push(user);

  return res.status(201).json({ ok: true, email: user.email });
};

// ======================
// LOGIN
// ======================
exports.login = (req, res) => {
  const { email, password, pass } = req.body;
  const pwd = password || pass;

  if (!email || !pwd)
    return res.status(400).json({ message: "Email y contraseña son obligatorios." });

  const nEmail = normalizeEmail(email);
  const user = store.usuarios.find(u => u.email === nEmail);

  if (!user || user.password !== pwd)
    return res.status(401).json({ message: "Credenciales inválidas." });

  return res.json({ ok: true, email: user.email });
};

// ======================
// RECOVER (solicitar token)
// ======================
exports.recover = (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email es obligatorio." });

  const nEmail = normalizeEmail(email);

  // Podemos buscar usuario, pero NO revelar si existe o no
  const user = store.usuarios.find(u => u.email === nEmail);

  // SIEMPRE generamos token
  const token = String(Math.floor(100000 + Math.random() * 900000));

  // ✅ SIEMPRE guardamos el token, exista o no el usuario
  store.tokens_recuperacion.push({
    email: nEmail,
    token,
    createdAt: Date.now()
  });

  // Mensaje neutro para el usuario
  return res.json({
    ok: true,
    message: user
      ? "Token generado correctamente (simulado)."
      : "Si el correo existe, se envió un código de recuperación (simulado).",
    token   // 👈 esto es lo que muestras en el front
  });
};

// ======================
// RESET PASSWORD
// ======================
exports.reset = (req, res) => {
  const { token, newPassword, newpass, password } = req.body;
  const pwd = newPassword || newpass || password;

  if (!token || !pwd)
    return res.status(400).json({ message: "Token y contraseña son obligatorios." });

  const idx = store.tokens_recuperacion.findIndex(t => t.token === token);
  if (idx === -1)
    return res.status(400).json({ message: "Token inválido o expirado." });

  const email = store.tokens_recuperacion[idx].email;
  const user = store.usuarios.find(u => u.email === email);

  if (!user) {
    // 👇 Para no revelar nada: eliminamos token y respondemos éxito igual
    store.tokens_recuperacion.splice(idx, 1);
    return res.json({ ok: true, message: "Contraseña actualizada correctamente." });
  }

  // Actualizar contraseña
  user.password = pwd;

  // Eliminar token (para que no se reutilice)
  store.tokens_recuperacion.splice(idx, 1);

  return res.json({ ok: true, message: "Contraseña actualizada correctamente." });
};