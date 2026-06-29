import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:8080/api",
    baseURL: "http://192.168.1.4:8080/api",
});

let storeRef = null;
let isRedirecting = false;

export function setStore(store) {
    storeRef = store;
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && storeRef && !isRedirecting) {
            isRedirecting = true;
            storeRef.dispatch({ type: "auth/logout" });
            if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                window.location.replace("/login");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
