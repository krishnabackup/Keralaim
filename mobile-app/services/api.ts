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
  (res) => res,
  (error) => {
    const backendData = error?.response?.data
    error.customMessage = backendData || "Server Error"
    error.success = backendData?.success ?? false
    return Promise.reject(error)
  }
);

export default api