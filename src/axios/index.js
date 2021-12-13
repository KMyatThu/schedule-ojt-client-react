import axios from "axios";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return "Bearer " + user.accessToken;
  } else {
    return "";
  }
}

const instance = axios.create({
  baseURL: "http://localhost:8000/api/"
});

instance.interceptors.request.use(function (config) {
  config.headers.Authorization =  getToken();
  return config;
});

export default instance;
