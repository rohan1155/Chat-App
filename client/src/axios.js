import axios from "axios";

const instance = axios.create({
  baseURL: "https://chat-app-36pq.onrender.com/",
});

export default instance;
