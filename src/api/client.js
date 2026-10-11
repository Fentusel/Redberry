import axios from "axios";
import { store } from "../store/store.js";
import { openLogin } from "../store/slices/authSlice.js";
import { addPending } from "../features/auth/authQueue.js";

const client = axios.create({
    baseURL: "https://api.kinoxii.redberryinternship.ge/api",
    headers: { accept: "application/json" },
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

client.interceptors.response.use(
    (res) => res,
    (error) => {
        const config = error.config;

        if (error.response?.status === 401 && config && !config._retried) {
            return new Promise((resolve, reject) => {
                addPending({
                    run: () => {
                        config._retried = true;
                        client(config).then(resolve, reject);
                    },
                    cancel: () => reject(error),
                });
                store.dispatch(openLogin());
            });
        }

        return Promise.reject(error);
    }
);

export default client;