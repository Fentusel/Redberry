import axios from 'axios'
import client from './client' // see the note below about client.js

const BASE = 'https://api.kinoxii.redberryinternship.ge/api'

export const getSessions = (params, signal) =>
    axios.get(`${BASE}/sessions`, { params, signal }).then((res) => res.data)

export const getFilterOptions = () =>
    axios.get(`${BASE}/filter-options`).then((res) => res.data)

export const getSeats = (sessionId) =>
    client.get(`${BASE}/sessions/${sessionId}/seats`).then((res) => res.data)

export const createHold = (sessionId, seats) =>
    client.post(`${BASE}/sessions/${sessionId}/holds`, { seats }).then((res) => res.data)

// ASSUMPTION: these three paths. Confirm in Swagger.
export const getHold = (holdId) =>
    client.get(`${BASE}/holds/${holdId}`).then((res) => res.data)

export const releaseHold = (holdId) =>
    client.delete(`${BASE}/holds/${holdId}`)

export const checkout = (body) =>
    client.post(`${BASE}/checkout`, body).then((res) => res.data)