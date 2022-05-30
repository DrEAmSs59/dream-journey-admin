import request from './request'
import {IHotelCategory, IHotelCategoryQuery, ILogin, IUserInfo} from "../interfaces/Interface";
import React from "react";
import {serverConfig} from "../serverConfig";

// 管理员登录接口
export const AdminLoginApi = (params: ILogin) => request.post('/admin/adminLogin', params);

// 获取当前用户接口
export const CurrentUserInfoApi = () => request.get("/user/currentUserInfo");

// 新增或修改分类接口
export const CreateOrUpdateHotelCategoryApi = (params: IHotelCategory) => request.post("/hotel/category/createOrUpdate", params);

// 查询酒店分类接口
export const QueryHotelCategoryListApi = (params: IHotelCategoryQuery) => request.post("/hotel/category/queryList", params);

// 查询酒店分类层级为1接口
export const QueryHotelCategoryLevel1ListApi = () => request.get("/hotel/category/queryLevel1List");

// 根据id查询单条酒店分类接口
export const QueryHotelCategoryByIdApi = (params: string) => request.get("/hotel/category/queryById" + params)

// 删除酒店分类接口
export const DeleteHotelCategoryByIdsApi = (params: string[] | React.ReactNode[]) => request.post("/hotel/category/deleteByIds", params);

// 上传用户头像接口
export const UploadUserAvatarApi = serverConfig.baseURL + "/user/uploadAvatar";

// 获取用户头像接口
export const GetUserAvatarApi = serverConfig.baseURL + "/user/getAvatar";

// 注册或更新用户接口
export const RegisterOrUpdateUserInfoApi = (params: IUserInfo) => request.post("/user/registerOrUpdate", params);

// 获取用户列表接口
export const QueryUserListApi = (params: string) => request.get("/admin/queryUserList" + params)

// 冻结用户接口
export const BanUserApi = (params: string) => request.get("/admin/ban" + params);

// 解冻用户接口
export const UnbanUserApi = (params: string) => request.get("/admin/unban" + params);