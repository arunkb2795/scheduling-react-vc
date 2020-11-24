import axios from "axios";
const token = "a793e4050d467828172c5589b7e15f15d18e0556";
//const token = window.schedule_token;
// `Bearer ${token}`;
const instance = axios.create({
  baseURL: "https://schedule-app.litmus7.com/",
  //baseURL: window.schedule_app_url,
});

instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
instance.defaults.headers.post["Content-Type"] = "application/json";
export default instance;
