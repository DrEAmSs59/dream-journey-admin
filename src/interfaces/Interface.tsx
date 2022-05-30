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
    userStatus: number | string;
    userStatusDesc: string;
    userTypeDesc: string;
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
    ids?: string[] | React.ReactNode[];
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

// 分页对象
export interface IPage {
    countId?: string | number;
    current: number;
    maxLimit?: number;
    optimizeCountSql: boolean;
    orders: any[];
    pages: number;
    records: any[];
    searchCount: boolean;
    size: number;
    total: number;
}

// 查询用户列表
export interface IUserQuery {
    userStatus?: number;
    pageIndex: number;
    pageSize: number;
    username?: string;
    mobile?: number;
    email?: string;
}