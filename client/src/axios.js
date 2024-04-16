import axios from "axios";

const instance = axios.create({
  baseURL: "https://chat-app-f747.onrender.com",
});

export default instance;
