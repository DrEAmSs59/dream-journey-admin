import React, {useEffect} from 'react';
import './less/App.less';
import {Breadcrumb, Layout, Space} from "antd";
import TopHeader from "./components/TopHeader";
import LeftSider from "./components/LeftSider";
import HotelCategory from "./components/HotelCategory";
import UserSetting from "./components/UserSetting";
import UserList from "./components/UserList";

export const BreadcrumbList = React.createContext<any>(null);

function App() {

    const {Content, Footer} = Layout;
    const [breadcrumb, setBreadcrumb] = React.useState<string[]>(["仪表盘"]);
    const [breadcrumbItem, setBreadcrumbItem] = React.useState<any>(null);

    useEffect(() => {
        setBreadcrumbItem(
            breadcrumb.reverse().map((item: string, index: number) => {
                return (
                    <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                );
            }));
    }, [breadcrumb])

    const contentView = () => {
        switch (breadcrumb.at(breadcrumb.length - 1)) {
            case "酒店分类" :
                return (<HotelCategory/>);
            case "个人设置" :
                return (<UserSetting/>);
            case "用户管理" :
                return (<UserList/>);
            default :
                return (
                    <Space>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            Bill is a cat.
                        </div>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            Bill is a cat.
                        </div>
                    </Space>
                );
        }
    }

    return (
        <Layout style={{minHeight: '100vh', flexDirection: "row", lineHeight: "0"}}>
            <BreadcrumbList.Provider value={{breadcrumb, setBreadcrumb}}>
                <LeftSider/>
            </BreadcrumbList.Provider>
            <Layout className="site-layout">
                <BreadcrumbList.Provider value={{breadcrumb, setBreadcrumb}}>
                    <TopHeader/>
                </BreadcrumbList.Provider>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 16px'}}>
                        {breadcrumbItem}
                    </Breadcrumb>
                    {
                        contentView()
                    }
                </Content>
                {/*<Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>*/}
            </Layout>
        </Layout>
    );
}

export default App;
