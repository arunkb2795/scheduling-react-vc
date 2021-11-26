import axios from "axios";
import querystring from "querystring";
const token = "07fad53bb67a22e2b1b610c7a57e977a67988f66";
const phpURL = "https://schedule-app.litmus7.com/";
// const token = window.schedule_token;
// const phpURL= window.schedule_app_url;

const getClient = (url) => {
  const options = {
    baseURL: phpURL,
  };

  const client = axios.create(options);

  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // request interceptor
  client.interceptors.request.use(
    async function (config) {
      return config;
    },
    function (error) {
      console.log(error);
    }
  );

  // Add a response interceptor
  client.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      console.log("error in interceptor", error);

      return Promise.reject(error);
    }
  );

  return client;
};

class ApiClient {
  constructor(url = null) {
    this.client = getClient(url);
  }

  get(url, data = null, conf = {}) {
    console.log(url);
    if (data && typeof data === "object") {
      url = `${url}?${querystring.stringify(data)}`;
    }
    return this.client
      .get(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  delete(url, conf = {}) {
    return this.client
      .delete(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  head(url, conf = {}) {
    return this.client
      .head(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  options(url, conf = {}) {
    return this.client
      .options(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  post(url, data = {}, conf = {}) {
    return this.client
      .post(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  put(url, data = {}, conf = {}) {
    return this.client
      .put(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  patch(url, data = {}, conf = {}) {
    return this.client
      .patch(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
}

export { ApiClient };
