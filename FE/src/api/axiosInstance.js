import axios from "axios";
const BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true, // Send refresh token (cookie)
});

//  Attach Access Token to Every Request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Handle Expired Access Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Access token expired, trying to refresh...");

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.token;
        localStorage.setItem("token", newAccessToken);

        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...");
        localStorage.removeItem("token");
        // window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
