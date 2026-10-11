import client from "./client.js";

export async function getVenues() {
    const { data } = await client.get("/venues");
    return data.data ?? data;
}

export async function updateProfile(payload) {
    const { data } = await client.put("/profile", payload);
    return data.data?.user ?? data.data;
}