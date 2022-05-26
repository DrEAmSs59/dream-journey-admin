import React from 'react';
import {Tabs} from 'antd';
import UserSettingBase from "./UserSettingBase";

const {TabPane} = Tabs;

export default function UserSetting() {
    return (
        <div className="site-layout-background" style={{padding: 24, minHeight: 360, height: "92%"}}>
            <Tabs tabPosition={"left"}>
                <TabPane tab="基本设置" key="1">
                    <UserSettingBase/>
                </TabPane>
                <TabPane tab="安全设置" key="2">
                    Content of Tab 2
                </TabPane>
                <TabPane tab="新消息通知" key="3">
                    Content of Tab 3
                </TabPane>
            </Tabs>
        </div>
    )
}