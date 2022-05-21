import request from './request'
import {ILogin} from "../interfaces/Interface";

// 管理员登录接口
export const AdminLoginApi = (params: ILogin) => request.post('/user/adminLogin', params);

// 获取当前用户接口
export const CurrentUserInfoApi = () => request.get("/user/currentUserInfo");