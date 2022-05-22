import React, {useEffect} from 'react';
import './less/App.less';
import {Breadcrumb, Layout, Space} from "antd";
import TopHeader from "./components/TopHeader";
import LeftSider from "./components/LeftSider";

export const BreadcrumbList = React.createContext<any>(null);

function App() {

    const {Content, Footer} = Layout;
    const [breadcrumb, setBreadcrumb] = React.useState<string[]>(["仪表盘"]);
    const [breadcrumbItem, setBreadcrumbItem] = React.useState<any>(null);

    useEffect(() => {
        setBreadcrumbItem(
            breadcrumb.map((item: string) => {
                return (
                    <Breadcrumb.Item>{item}</Breadcrumb.Item>
                );
            }));
    }, [breadcrumb])

    return (
        <Layout style={{minHeight: '100vh', flexDirection: "row"}}>
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
                    <Space>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            Bill is a cat.
                        </div>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            Bill is a cat.
                        </div>
                    </Space>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
}

export default App;
