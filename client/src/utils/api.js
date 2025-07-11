import axios from "axios";

const token = localStorage.getItem("username");
console.log(token);

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
