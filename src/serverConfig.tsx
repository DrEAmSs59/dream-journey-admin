import {AxiosOption} from "./interfaces/Interface";

// 后台服务地址及请求超时配置
export const serverConfig: AxiosOption = {
    baseURL: 'http://192.168.15.236:8081/api',
    timeout: 10000
}