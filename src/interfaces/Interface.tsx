import React from "react";

// 登录对象接口
export interface ILogin {
    username: string;
    password: string;
}

// Axios配置对象接口
export interface AxiosOption {
    baseURL: string;
    timeout: number;
}

// 用户对象接口
export interface IUserInfo {
    id: string;
    username: string;
    nickname: string;
    mobile: number;
    email: string;
    avatar: string;
    genderDesc: string;
    birthday: Date | string;
    city: string;
    job: string;
    sign: string;
    typeDesc: string;
    sourceTypeDesc: string;
}

// 酒店分类表头
export interface IHotelCategoryDataType {
    id: string;
    key: React.ReactNode;
    name: string;
    description?: string;
    level: number;
    sort: number;
    createTime: Date | string;
    updateTime: Date | string;
    children?: IHotelCategoryDataType[];
}

// 对话框显示
export interface IModalVisible {
    visible: boolean;
    key: number;
    id?: string;
}

// 酒店分类
export interface IHotelCategory {
    id?: string;
    name: string;
    description: string;
    level: number;
    sort: number;
    parentId?: string;
}

// 查询酒店列表
export interface IHotelCategoryQuery {
    name?: string;
    level?: number;
    sort?: number;
    pageIndex: number;
    pageSize: number;
}