import request from './request'
import {IHotelCategory, IHotelCategoryQuery, ILogin} from "../interfaces/Interface";
import React from "react";

// 管理员登录接口
export const AdminLoginApi = (params: ILogin) => request.post('/user/adminLogin', params);

// 获取当前用户接口
export const CurrentUserInfoApi = () => request.get("/user/currentUserInfo");

// 新增或修改分类接口
export const CreateOrUpdateHotelCategoryApi = (params: IHotelCategory) => request.post("/hotel/category/createOrUpdate", params);

// 查询酒店分类接口
export const QueryHotelCategoryListApi = (params: IHotelCategoryQuery) => request.post("/hotel/category/queryList", params);

// 查询酒店分类层级为1接口
export const QueryHotelCategoryLevel1ListApi = () => request.get("/hotel/category/queryLevel1List");

// 根据id查询单条酒店分类接口
export const QueryHotelCategoryById = (params: string) => request.get("/hotel/category/queryById" + params)

// 删除酒店分类
export const DeleteHotelCategoryByIds = (params: string[] | React.ReactNode[]) => request.post("/hotel/category/deleteByIds", params);