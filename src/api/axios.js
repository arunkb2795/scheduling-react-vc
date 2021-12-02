import axios from "axios";

const token = window.schedule_token;

const instance = axios.create({
  baseURL: window.schedule_app_url,
});

instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
instance.defaults.headers.post["Content-Type"] = "application/json";
export default instance;
