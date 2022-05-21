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