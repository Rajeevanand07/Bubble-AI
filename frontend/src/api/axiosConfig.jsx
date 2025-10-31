import axios from "axios";

const instance = axios.create({
  baseURL: "https://bubble-ai-z0vn.onrender.com"
});

export default instance;