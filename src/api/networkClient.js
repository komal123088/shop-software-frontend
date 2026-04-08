import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class NetworkClient {
  constructor() {
    this.baseURL = BACKEND_URL;
    this.apiURL = `${BACKEND_URL}/api`;

    // Set axios default
    axios.defaults.baseURL = this.apiURL;

    console.log("✅ Backend URL:", this.apiURL);
  }

  getApiUrl() {
    return this.apiURL;
  }

  getBaseUrl() {
    return this.baseURL;
  }

  getImageUrl(imagePath) {
    if (!imagePath) return "";
    const cleanPath = imagePath.replace(/^\/api/, "");
    return `${this.baseURL}${cleanPath}`;
  }

  // Backward compatibility
  async findWorkingBackend() {
    // Production mein health check skip karo
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    this.setBackend(backendUrl);
    return true;
  }
}

export const networkClient = new NetworkClient();
