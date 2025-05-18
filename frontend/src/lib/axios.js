import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api", // Change this if your API base URL is different
  headers: {
    Accept: "application/json",
  },
});

export default instance;
