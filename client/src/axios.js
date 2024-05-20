import axios from "axios";

const instance = axios.create({
  baseURL: "https://chat-app-server-rohan1155s-projects.vercel.app/",
});
// const instance = axios.create({
//   baseURL: "http://localhost:5000",
// });

export default instance;
