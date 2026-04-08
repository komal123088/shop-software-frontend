export const getLocalIP = () => {
  return import.meta.env.VITE_BACKEND_URL || "";
};

export const getBaseURL = () => {
  return import.meta.env.VITE_BACKEND_URL || "";
};

export const getApiBaseURL = () => {
  return import.meta.env.VITE_REACT_BACKEND_BASE || `${getBaseURL()}/api`;
};
