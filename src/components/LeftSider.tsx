import {Menu, MenuProps} from "antd";
import React, {useContext, useState} from "react";
import Sider from "antd/es/layout/Sider";
import {DesktopOutlined, PieChartOutlined, TeamOutlined, UserOutlined, ShoppingOutlined
    , ProfileOutlined, MessageOutlined, AccountBookOutlined} from "@ant-design/icons";
import {BreadcrumbList} from "../App";

export default function LeftSider() {

    const {breadcrumb, setBreadcrumb} = useContext(BreadcrumbList);

    type MenuItem = Required<MenuProps>['items'][number];

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
        getItem('仪表盘', '仪表盘', <PieChartOutlined/>),
        getItem('我的工作', '我的工作', <DesktopOutlined/>),
        getItem('用户管理', '用户管理', <TeamOutlined/>),
        getItem('商品管理', '商品管理', <ShoppingOutlined />),
        getItem('分类管理', '分类管理', <ProfileOutlined />, [
            getItem('酒店分类', '酒店分类')
        ]),
        getItem('订单管理', '订单管理', <AccountBookOutlined />),
        getItem('评论管理', '评论管理', <MessageOutlined />),
        getItem('个人信息', '个人信息', <UserOutlined/>, [
            getItem('个人中心', '个人中心'),
            getItem('个人设置', '个人设置')
        ]),
    ];

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    const onMenuClick = (e: any) => {
        setBreadcrumb(e.keyPath);
    }

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['仪表盘']} mode="inline" items={items} onClick={onMenuClick}/>
        </Sider>
    );
}