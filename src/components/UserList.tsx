import React, {useState, useEffect} from 'react';
import {List, message, Avatar, Button, Space, Input, Form, Row, Modal, Select} from 'antd';
import "../less/UserList.less";
import {
    SearchOutlined, UserOutlined, PhoneOutlined, MailOutlined, CloseCircleOutlined, CheckCircleOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import {IPage, IUserInfo, IUserQuery} from "../interfaces/Interface";
import {BanUserApi, GetUserAvatarApi, QueryUserListApi, UnbanUserApi} from "../request/api";
import {useNavigate} from "react-router-dom";

export default function UserList() {

    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [searchLoading, setSearchLoading] = useState<boolean>(true);
    const [queryUserParams, setQueryUserParams] = useState<IUserQuery>({pageIndex: 1, pageSize: 9});
    const [pagination, setPagination] = useState<IPage>({
        countId: undefined,
        current: 0,
        maxLimit: 0,
        optimizeCountSql: false,
        orders: [],
        pages: 0,
        records: [],
        searchCount: false,
        size: 0,
        total: 0
    });

    const onQueryUserList = (searchParams: IUserQuery) => {
        console.log(searchParams);
        setSearchLoading(true);
        let params: string = "?pageIndex=" + searchParams.pageIndex + "&pageSize=" + searchParams.pageSize;
        if (searchParams.username !== null && searchParams.username !== undefined) {
            params = params + "&username=" + searchParams.username;
        }
        if (searchParams.mobile !== null && searchParams.mobile !== undefined) {
            params = params + "&mobile=" + searchParams.mobile;
        }
        if (queryUserParams.email !== null && searchParams.email !== undefined) {
            params = params + "&email=" + searchParams.email;
        }
        if (queryUserParams.userStatus !== null && searchParams.userStatus !== undefined) {
            params = params + "&userStatus=" + searchParams.userStatus;
        }
        QueryUserListApi(params).then((res: any) => {
            setPagination(res);
            setSearchLoading(false);
        }).catch((err: any) => {
            setSearchLoading(false);
            if (err.response.status === 401) {
                message.error("用户信息过期或不合法！请重新登录！", 1)
                    .then(() => navigate("/login"));
            } else {
                message.error("查询失败：" + err.response.data, 1).then();
            }
        })
    }

    useEffect(() => {
        onQueryUserList(queryUserParams);
    }, []);

    const onSearchFinish = (searchParams: IUserQuery) => {
        searchParams.pageIndex = 1;
        searchParams.pageSize = 9;
        setQueryUserParams(searchParams);
        onQueryUserList(searchParams);
    }

    const confirmBanOrUnbanOnClick = (id: string, userStatus: number | string) => {
        if (userStatus === 0) {
            BanUserApi("/" + id).then(() => {
                message.success("封禁成功！").then();
                queryUserParams.pageIndex = 1;
                queryUserParams.pageSize = 9;
                setQueryUserParams(queryUserParams);
                onQueryUserList(queryUserParams);
            }).catch((err: any) => {
                message.error("封禁失败：" + err.response.data).then();
            })
        } else if (userStatus === 1) {
            UnbanUserApi("/" + id).then(() => {
                message.success("解封成功！").then();
                queryUserParams.pageIndex = 1;
                queryUserParams.pageSize = 9;
                setQueryUserParams(queryUserParams);
                onQueryUserList(queryUserParams);
            }).catch((err: any) => {
                message.error("解封失败：" + err.response.data).then();
            })
        }
    }

    const banOrUnbanOnClick = (id: string, userStatus: number | string) => {
        if (userStatus === 0) {
            Modal.confirm({
                title: '您正在封禁一名用户！',
                icon: <ExclamationCircleOutlined/>,
                content: '封禁该用户后，会导致该用户无法正常登录！',
                okText: '确认',
                cancelText: '取消',
                maskClosable: true,
                onOk: () => confirmBanOrUnbanOnClick(id, userStatus)
            });
        } else if (userStatus === 1) {
            Modal.confirm({
                title: '您正在解封一名用户！',
                icon: <ExclamationCircleOutlined/>,
                content: '解封该用户后，该用户能够正常登录访问网站！',
                okText: '确认',
                cancelText: '取消',
                maskClosable: true,
                onOk: () => confirmBanOrUnbanOnClick(id, userStatus)
            });
        }
    }

    const showBanOrUnban = (userStatus: number | string, id: string) => {
        if (userStatus === 0) {
            return (
                <Button type="primary" danger icon={<CloseCircleOutlined/>}
                        onClick={() => banOrUnbanOnClick(id, userStatus)}>封禁</Button>);
        } else if (userStatus === 1) {
            return (<Button type="primary" icon={<CheckCircleOutlined/>}
                            onClick={() => banOrUnbanOnClick(id, userStatus)}>解封</Button>);
        }
    }

    const userStatusDropdown = [
        {
            label: "未封禁",
            value: 0,
        },
        {
            label: "已封禁",
            value: 1,
        }
    ];

    return (
        <div className="site-layout-background" style={{padding: 24, minHeight: 360, height: "92%"}}>
            <div className="search">
                <Form layout="horizontal"
                      form={form}
                      onFinish={onSearchFinish}>
                    <Row>
                        <Space>
                            <Form.Item name="username">
                                <Input prefix={<UserOutlined/>} allowClear placeholder="请输入用户名"/>
                            </Form.Item>
                            <Form.Item name="mobile">
                                <Input prefix={<PhoneOutlined/>} allowClear placeholder="请输入电话号码"/>
                            </Form.Item>
                            <Form.Item name="email">
                                <Input prefix={<MailOutlined/>} allowClear placeholder="请输入电子邮箱"/>
                            </Form.Item>
                            <Form.Item name="userStatus">
                                <Select placeholder="请选择一个分类层级" allowClear options={userStatusDropdown}></Select>
                            </Form.Item>
                            <Form.Item>
                                <Button loading={searchLoading} type="primary" htmlType="submit"
                                        icon={<SearchOutlined/>}>搜索</Button>
                            </Form.Item>
                        </Space>
                    </Row>
                </Form>
            </div>
            <div className="list">
                <List
                    dataSource={pagination.records}
                    pagination={{
                        onChange: page => {
                            queryUserParams.pageIndex = page;
                            setQueryUserParams(queryUserParams);
                            onQueryUserList(queryUserParams);
                        },
                        showTotal: (total: number) => `共 ${total} 条`,
                        defaultCurrent: 1,
                        current: Number(pagination.current),
                        pageSize: pagination.size,
                        total: pagination.total,
                        showSizeChanger: false
                    }}
                    renderItem={(item: IUserInfo) => (
                        <List.Item key={item.id} style={{width: "100%"}}>
                            <List.Item.Meta
                                avatar={<Avatar src={GetUserAvatarApi + "?avatar=" + item.avatar}
                                                icon={<UserOutlined/>}/>}
                                title={<a href="#">{item.nickname}    ({item.userStatusDesc})</a>}
                                description={`邮箱：${item.email}   电话号码：${item.mobile}   用户类型：${item.userTypeDesc}`}
                            />
                            {showBanOrUnban(item.userStatus, item.id)}
                        </List.Item>
                    )}
                    loading={searchLoading}>
                </List>
            </div>
        </div>
    )
}