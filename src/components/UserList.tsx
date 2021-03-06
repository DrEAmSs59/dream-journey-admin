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
                message.error("???????????????????????????????????????????????????", 1)
                    .then(() => navigate("/login"));
            } else {
                message.error("???????????????" + err.response.data, 1).then();
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
                message.success("???????????????").then();
                queryUserParams.pageIndex = 1;
                queryUserParams.pageSize = 9;
                setQueryUserParams(queryUserParams);
                onQueryUserList(queryUserParams);
            }).catch((err: any) => {
                message.error("???????????????" + err.response.data).then();
            })
        } else if (userStatus === 1) {
            UnbanUserApi("/" + id).then(() => {
                message.success("???????????????").then();
                queryUserParams.pageIndex = 1;
                queryUserParams.pageSize = 9;
                setQueryUserParams(queryUserParams);
                onQueryUserList(queryUserParams);
            }).catch((err: any) => {
                message.error("???????????????" + err.response.data).then();
            })
        }
    }

    const banOrUnbanOnClick = (id: string, userStatus: number | string) => {
        if (userStatus === 0) {
            Modal.confirm({
                title: '??????????????????????????????',
                icon: <ExclamationCircleOutlined/>,
                content: '????????????????????????????????????????????????????????????',
                okText: '??????',
                cancelText: '??????',
                maskClosable: true,
                onOk: () => confirmBanOrUnbanOnClick(id, userStatus)
            });
        } else if (userStatus === 1) {
            Modal.confirm({
                title: '??????????????????????????????',
                icon: <ExclamationCircleOutlined/>,
                content: '???????????????????????????????????????????????????????????????',
                okText: '??????',
                cancelText: '??????',
                maskClosable: true,
                onOk: () => confirmBanOrUnbanOnClick(id, userStatus)
            });
        }
    }

    const showBanOrUnban = (userStatus: number | string, id: string) => {
        if (userStatus === 0) {
            return (
                <Button type="primary" danger icon={<CloseCircleOutlined/>}
                        onClick={() => banOrUnbanOnClick(id, userStatus)}>??????</Button>);
        } else if (userStatus === 1) {
            return (<Button type="primary" icon={<CheckCircleOutlined/>}
                            onClick={() => banOrUnbanOnClick(id, userStatus)}>??????</Button>);
        }
    }

    const userStatusDropdown = [
        {
            label: "?????????",
            value: 0,
        },
        {
            label: "?????????",
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
                                <Input prefix={<UserOutlined/>} allowClear placeholder="??????????????????"/>
                            </Form.Item>
                            <Form.Item name="mobile">
                                <Input prefix={<PhoneOutlined/>} allowClear placeholder="?????????????????????"/>
                            </Form.Item>
                            <Form.Item name="email">
                                <Input prefix={<MailOutlined/>} allowClear placeholder="?????????????????????"/>
                            </Form.Item>
                            <Form.Item name="userStatus">
                                <Select placeholder="???????????????????????????" allowClear options={userStatusDropdown}></Select>
                            </Form.Item>
                            <Form.Item>
                                <Button loading={searchLoading} type="primary" htmlType="submit"
                                        icon={<SearchOutlined/>}>??????</Button>
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
                        showTotal: (total: number) => `??? ${total} ???`,
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
                                description={`?????????${item.email}   ???????????????${item.mobile}   ???????????????${item.userTypeDesc}`}
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