import axios from "axios";
const token = "07fad53bb67a22e2b1b610c7a57e977a67988f66";
// const token = window.schedule_token;
// `Bearer ${token}`;
const instance = axios.create({
  baseURL: "https://schedule-app.litmus7.com/",
  // baseURL: window.schedule_app_url,
});

instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
instance.defaults.headers.post["Content-Type"] = "application/json";
export default instance;
