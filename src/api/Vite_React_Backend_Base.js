// src/api/Vite_React_Backend_Base.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BACKEND_API = import.meta.env.VITE_REACT_BACKEND_BASE;

export const ViteBackendIP = BACKEND_API;

export const VITE_LOCAL_IP = "";
export const VITE_BACKEND_PORT = 443;
export const VITE_LOCAL_BACKEND = BACKEND_URL;
export const VITE_NETWORK_BACKEND = BACKEND_URL;
export const VITE_LOCAL_API = BACKEND_API;
export const VITE_NETWORK_API = BACKEND_API;

console.log("✅ Using VITE_REACT_BACKEND_BASE from env:", BACKEND_API);
console.log("🔧 Config loaded:", {
  VITE_REACT_BACKEND_BASE: BACKEND_API,
  VITE_BACKEND_URL: BACKEND_URL,
});

export default ViteBackendIP;
