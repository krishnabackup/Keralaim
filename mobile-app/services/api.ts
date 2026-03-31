import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL : "http://192.168.18.8:5000/api",
    timeout : 30000,
    headers : {"Content-Type" : "application/json"}
})

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - logging out");

      await SecureStore.deleteItemAsync("token");

      // 👉 Optional: redirect to login
      // router.replace("/login") (handled in UI layer)
    }

    return Promise.reject(error);
  }
);

export default api