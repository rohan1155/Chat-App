import axios from "axios";

const instance = axios.create({
  baseURL: "https://chat-app-server-beryl-sigma.vercel.app",
});

export default instance;
