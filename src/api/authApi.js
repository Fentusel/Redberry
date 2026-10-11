import axios from "axios";

const api = axios.create({
    baseURL: "https://api.kinoxii.redberryinternship.ge/api",
    headers: { accept: "application/json" },
});

export async function registerUser({ username, email, password, confirmPassword, avatar }) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    if (avatar) formData.append("avatar", avatar);
    const { data } = await api.post("/register", formData);
    return data.data;
}

export async function loginUser({ email, password }) {
    const { data } = await api.post("/login", { email, password });
    return data.data;
}

export async function logoutUser(token) {
    if (!token) return;
    try {
        await api.post("/logout", null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {}
}