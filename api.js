// api.js
const API_BASE = "http://localhost:3000"; // tu API en Node

// ==== AUTH ====
async function apiRegister(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

async function apiRecover(email) {
  const res = await fetch(`${API_BASE}/api/auth/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

// ==== CATÁLOGO ====
async function apiCatalogoList() {
  const res = await fetch(`${API_BASE}/api/catalogo`);
  return res.json();
}

async function apiCatalogoSearch(q, categoria, page = 1, perPage = 9) {
  const params = new URLSearchParams({
    q,
    categoria,
    page,
    perPage,
  });
  const res = await fetch(`${API_BASE}/api/catalogo/search?` + params.toString());
  return res.json();
}

// ==== PEDIDOS / CHECKOUT ====
async function apiCheckout(productos) {
  const res = await fetch(`${API_BASE}/api/pedidos/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productos }),
  });
  return res.json();
}

async function apiEstadoPedido(id) {
  const res = await fetch(`${API_BASE}/api/pedidos/estado/${id}`);
  return res.json();
}

// ==== BOLETA / REPORTES ====
async function apiBoleta(ordenId) {
  const res = await fetch(`${API_BASE}/api/boletas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ordenId }),
  });
  return res.json();
}

async function apiReportesVentas() {
  const res = await fetch(`${API_BASE}/api/reportes/ventas`);
  return res.json();
}

// ==== CARRITO LOCAL ====
function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito") || "[]");
}

function setCarrito(items) {
  localStorage.setItem("carrito", JSON.stringify(items));
}

function addToCarrito(nombre, precio) {
  const carrito = getCarrito();
  carrito.push({ nombre, precio });
  setCarrito(carrito);
}