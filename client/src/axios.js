import axios from "axios";

const instance = axios.create({
  baseURL: "https://chat-app-server-kgm4755l5-rohan1155s-projects.vercel.app",
});

export default instance;
