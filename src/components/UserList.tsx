import React, {useState, useEffect} from 'react';
import {List, message, Avatar, Button, Space, Input, Form, Row} from 'antd';
import "../less/UserList.less";
import {SearchOutlined, UserOutlined, PhoneOutlined, MailOutlined, CloseCircleOutlined, CheckCircleOutlined}
    from "@ant-design/icons";
import {IPage, IUserInfo, IUserQuery} from "../interfaces/Interface";
import {GetUserAvatarApi, QueryUserListApi} from "../request/api";
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
        setSearchLoading(true);
        let params: string = "?pageIndex=" + searchParams.pageIndex + "&pageSize=" + searchParams.pageSize;
        if (searchParams.username) {
            params = params + "&username=" + searchParams.username;
        }
        if (searchParams.mobile) {
            params = params + "&mobile=" + searchParams.mobile;
        }
        if (queryUserParams.email) {
            params = params + "&email=" + searchParams.email;
        }
        QueryUserListApi(params).then((res: any) => {
            setPagination(res);
            setSearchLoading(false);
            message.success("查询成功", 1).then();
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

    const showBanOrUnban = (userStatus: number | string) => {
        if (userStatus === 0) {
            return (<Button type="primary" danger icon={<CloseCircleOutlined/>}>封禁</Button>);
        } else if (userStatus === 1) {
            return (<Button type="primary" icon={<CheckCircleOutlined/>}>解封</Button>);
        }
    }

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
                                title={<a href="">{item.nickname}</a>}
                                description={`邮箱：${item.email}   电话号码：${item.mobile}   用户类型：${item.userTypeDesc}`}
                            />
                            {showBanOrUnban(item.userStatus)}
                        </List.Item>
                    )}
                    loading={searchLoading}>
                </List>
            </div>
        </div>
    )
}