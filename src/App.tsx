import React, {useEffect, useState} from 'react';
import './less/App.less';
import {Breadcrumb, Layout, Menu, MenuProps, message} from "antd";
import {DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined,} from '@ant-design/icons';
import {IUserInfo} from "./interfaces/Interface";
import {CurrentUserInfoApi} from "./request/api";
import {useNavigate} from "react-router-dom";
import TopHeader from "./components/TopHeader";

function App() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("userInfo")) {
            let userInfo: IUserInfo = {
                avatar: "",
                birthday: "",
                city: "",
                email: "",
                genderDesc: "",
                id: "",
                job: "",
                mobile: 0,
                nickname: "",
                sign: "",
                sourceTypeDesc: "",
                typeDesc: "",
                username: ""
            }
            CurrentUserInfoApi().then((res: any) => {
                userInfo = res;
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
            }).catch(() => {
                message.error("用户信息过期或不合法！请重新登录！", 1)
                    .then(() => navigate("/login"));
            })
        }
    }, [navigate])

    type MenuItem = Required<MenuProps>['items'][number];

    const {Content, Footer, Sider} = Layout;

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
        } as MenuItem;
    }

    const items: MenuItem[] = [
        getItem('Option 1', '1', <PieChartOutlined/>),
        getItem('Option 2', '2', <DesktopOutlined/>),
        getItem('User', 'sub1', <UserOutlined/>, [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
        getItem('Files', '9', <FileOutlined/>),
    ];

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
            </Sider>
            <Layout className="site-layout">
                <TopHeader/>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        Bill is a cat.
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
}

export default App;
