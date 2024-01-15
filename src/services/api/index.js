import axios from "axios"
const baseURL = process.env.BASE_URL || "http://localhost:5000/"

export const api = axios.create({
  baseURL
})
