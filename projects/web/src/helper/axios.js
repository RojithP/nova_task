import axios from "axios";
import { API_URL } from "./url";

const axiosHttp = axios.create({
    baseURL: `${API_URL}`,
});

axiosHttp.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        return {
            ...config,
            headers: {
                ...(token !== null && { Authorization: `${token}` }),
                ...config.headers,
            },
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosHttp;