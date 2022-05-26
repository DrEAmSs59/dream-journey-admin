import React, {useEffect, useState} from 'react';
import {Form, Input, Cascader, Select, Button, Avatar, Space, Upload, UploadProps, message,} from 'antd';
import "../less/UserSettingBase.less";
import {UserOutlined, UploadOutlined} from '@ant-design/icons';
import {CurrentUserInfoApi, GetUserAvatarApi, RegisterOrUpdateUserInfoApi, UploadUserAvatarApi} from "../request/api";
import {IUserInfo} from "../interfaces/Interface";
import {useNavigate} from "react-router-dom";
import city from '../assets/city.json';

const {Option} = Select;

const formItemLayout = {
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

export default function UserSettingBase() {

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const [token, setToken] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");

    const onFormFinish = (values: any) => {
        let userJsonStr: any = localStorage.getItem("userInfo");
        values.id = JSON.parse(userJsonStr).id;
        RegisterOrUpdateUserInfoApi(values).then(() => {
            message.success("修改成功", 1).then(() => {
                CurrentUserInfoApi().then((res: any) => {
                    localStorage.setItem("userInfo", JSON.stringify(res));
                    setAvatar(res.avatar);
                }).catch(() => {
                    message.error("用户信息过期或不合法！请重新登录！", 1)
                        .then(() => navigate("/login"));
                })
            });
        }).catch((err: any) => {
            if (err.response.status === 401) {
                message.error("用户信息过期或不合法！请重新登录！", 1)
                    .then(() => navigate("/login"));
            } else {
                message.error("修改失败：" + err.response.data, 1).then();
            }
        })
    };

    const props: UploadProps = {
        beforeUpload: file => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('只能上传JPG/PNG文件!').then();
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('头像不能大于2M!').then();
            }
            return isJpgOrPng && isLt2M;
        },
        name: 'multipartFile',
        action: UploadUserAvatarApi,
        headers: {
            token: token
        },
        onChange(info: any) {
            if (info.file.status === 'done') {
                message.success("上传成功！").then();
                CurrentUserInfoApi().then((res: any) => {
                    localStorage.setItem("userInfo", JSON.stringify(res));
                    setAvatar(res.avatar);
                }).catch(() => {
                    message.error("用户信息过期或不合法！请重新登录！", 1)
                        .then(() => navigate("/login"));
                })
            } else if (info.file.status === 'error') {
                message.error("上传失败！").then();
            }
        }
    };

    useEffect(() => {
        let userJsonStr: any = localStorage.getItem("userInfo");
        let userInfo: IUserInfo = JSON.parse(userJsonStr);
        let tempToken: any = localStorage.getItem("token");
        form.setFieldsValue(userInfo);
        setToken(tempToken);
        setAvatar(userInfo.avatar);
    }, [form, avatar])

    return (
        <div className="user-info-box">
            <div className="title">
                基本设置
            </div>
            <div className="content">
                <div>
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="userInfo"
                        onFinish={onFormFinish}
                        scrollToFirstError
                    >
                        <div className="input-title">
                            用户名
                        </div>
                        <Form.Item
                            style={{width: "500px"}}
                            name="username"
                            rules={[{required: true, message: '请输入用户名！'}]}
                        >
                            <Input disabled/>
                        </Form.Item>
                        <div className="input-title">
                            昵称
                        </div>
                        <Form.Item
                            style={{width: "500px"}}
                            name="nickname"
                            tooltip="希望别人如何称呼您？"
                            rules={[{required: true, message: '请输入昵称！', whitespace: true}]}
                        >
                            <Input allowClear/>
                        </Form.Item>
                        <div className="input-title">
                            性别
                        </div>
                        <Form.Item
                            style={{width: "500px"}}
                            name="gender"
                            rules={[{required: true, message: '请选择性别！'}]}
                        >
                            <Select placeholder="请选择您的性别" allowClear>
                                <Option key={0} value={0}>男</Option>
                                <Option key={1} value={1}>女</Option>
                                <Option key={2} value={2}>其他</Option>
                            </Select>
                        </Form.Item>
                        <div className="input-title">
                            所在城市
                        </div>
                        <Form.Item
                            style={{width: "500px"}}
                            name="city"
                            rules={[
                                {type: 'array', required: false},
                            ]}
                        >
                            <Cascader options={city} allowClear/>
                        </Form.Item>
                        <div className="input-title">
                            电子邮箱
                        </div>
                        <Form.Item
                            style={{width: "500px"}}
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: '输入内容不为电子邮箱！',
                                },
                                {
                                    required: false
                                },
                            ]}
                        >
                            <Input allowClear/>
                        </Form.Item>
                        <div className="input-title">
                            电话号码
                        </div>
                        <Form.Item
                            style={{width: "500px"}}
                            name="mobile"
                            rules={[{required: false}]}
                        >
                            <Input allowClear/>
                        </Form.Item>
                        <div className="input-title">
                            个性签名
                        </div>
                        <Form.Item
                            style={{width: "500px"}}
                            name="sign"
                            rules={[{required: false}]}
                        >
                            <Input.TextArea allowClear showCount maxLength={100}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width: "335px", marginTop: "5px"}}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <div className="input-title">
                        头像
                    </div>
                    <Space direction="vertical">
                        <Avatar
                            size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 150}}
                            icon={<UserOutlined/>}
                            src={GetUserAvatarApi + "?avatar=" + avatar}
                        />
                        <Upload {...props} showUploadList={false}>
                            <Button icon={<UploadOutlined/>} style={{marginLeft: "20px"}}>更换头像</Button>
                        </Upload>
                    </Space>
                </div>
            </div>
        </div>
    )
}