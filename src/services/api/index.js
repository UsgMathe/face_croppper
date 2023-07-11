import axios from "axios"

// Vitor:
// const baseURL = process.env.BASE_URL || "http://192.168.51.213:5000/"

// Gabriel celular:
// const baseURL = process.env.BASE_URL || "http://192.168.43.69:5000/"

// Gabriel PC:
const baseURL = process.env.BASE_URL || "http://192.168.50.60:5000/"

export const api = axios.create({
  baseURL
})