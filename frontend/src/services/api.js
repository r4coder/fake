import axios from "axios";

const API = axios.create({
  baseURL: "https://fake-2-w9ip.onrender.com"
});

export const analyzeJob = (data) => {
  return API.post("/analyze", data);
};
