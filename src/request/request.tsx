import axios, {AxiosRequestConfig, AxiosResponse} from "axios"
import {serverConfig} from "../serverConfig";

// 创建一个单例
const instance = axios.create(serverConfig);

// 添加请求拦截器
instance.interceptors.request.use(function (config: AxiosRequestConfig) {
    // 设置请求时携带token
    let token = localStorage.getItem("token");
    if (token) {
        config.headers = {
            "token": token
        }
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response: AxiosResponse) {
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance;