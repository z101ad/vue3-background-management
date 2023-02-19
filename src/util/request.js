import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const ins = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",
  timeout: 5000,
});
//请求拦截
ins.interceptors.request.use((config) => {
  NProgress.start();
  if (config) {
    config.headers.Authorization = sessionStorage.getItem("token");
  }
  return config;
});
//响应拦截
ins.interceptors.response.use((config) => {
  NProgress.done();
  // console.log(config.data);
  return config.data.data;
});

export default ins;
