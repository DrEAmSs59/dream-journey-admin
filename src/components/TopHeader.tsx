import React, {useEffect, useState} from "react";
import {Avatar, Dropdown, Layout, Menu, message, Space, Tabs} from "antd";
import "../less/TopHeader.less";
import {IUserInfo} from "../interfaces/Interface";
import {UserOutlined, SettingOutlined, LogoutOutlined, GithubOutlined, BellOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {CurrentUserInfoApi} from "../request/api";

export default function TopHeader() {

    const {TabPane} = Tabs;
    const {Header} = Layout;

    const userMenu = (
        <Menu
            items={[
                {
                    label: <a>个人中心</a>,
                    key: '1',
                    icon: <UserOutlined/>
                },
                {
                    label: <a>个人设置</a>,
                    key: '2',
                    icon: <SettingOutlined/>
                },
                {
                    type: 'divider',
                },
                {
                    label: <a>退出登录</a>,
                    key: '3',
                    icon: <LogoutOutlined/>
                }
            ]}
            style={{marginTop: "25px", borderRadius: "5px"}}
        />
    );

    const callback = (key: any) => {
        console.log(key);
    }

    const informationMenu = (
        // <Menu
        //     items={[
        //         {
        //             label: <a>个人中心</a>,
        //             key: '1',
        //             icon: <UserOutlined/>
        //         },
        //         {
        //             label: <a>个人设置</a>,
        //             key: '2',
        //             icon: <SettingOutlined/>
        //         },
        //         {
        //             type: 'divider',
        //         },
        //         {
        //             label: <a>退出登录</a>,
        //             key: '3',
        //             icon: <LogoutOutlined/>
        //         }
        //     ]}
        //     style={{marginTop: "25px", borderRadius: "5px"}}
        // />
        <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Tab 1" key="1">
                Content of Tab Pane 1
            </TabPane>
            <TabPane tab="Tab 2" key="2">
                Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Tab 3" key="3">
                Content of Tab Pane 3
            </TabPane>
        </Tabs>
    );

    const [nickname, setNickname] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("")

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
                setTimeout(() => {
                    setNickname(userInfo.nickname);
                    setAvatar(userInfo.avatar)
                }, 0);
            }).catch(() => {
                message.error("用户信息过期或不合法！请重新登录！", 1)
                    .then(() => navigate("/login"));
            })
        } else {
            let userJsonStr: any = localStorage.getItem("userInfo");
            const userInfo: IUserInfo = JSON.parse(userJsonStr);
            setTimeout(() => {
                setNickname(userInfo.nickname);
                setAvatar(userInfo.avatar)
            }, 0);
        }
    }, [navigate])

    const onGithubClick = () => {
        window.open("https://github.com/DrEAmSs59/dream-journey-admin");
    }

    return (
        <Header className="header-box" style={{padding: 0}}>
            <div className="item-box">
                <Space size="large">
                    <a onClick={onGithubClick}>
                        <Avatar icon={<GithubOutlined/>}></Avatar>
                    </a>
                    <Dropdown overlay={informationMenu} placement="bottomRight">
                        <a onClick={e => e.preventDefault()}>
                            <Avatar icon={<BellOutlined/>}></Avatar>
                        </a>
                    </Dropdown>
                    <Dropdown overlay={userMenu}>
                        <a onClick={e => e.preventDefault()}>
                            <Space>
                                {
                                    avatar !== "" ? (<Avatar icon={<UserOutlined/>}/>) :
                                        (<Avatar src="https://joeschmoe.io/api/v1/random"/>)
                                }
                                <div>
                                    {nickname}
                                </div>
                            </Space>
                        </a>
                    </Dropdown>
                </Space>
            </div>
        </Header>
    )
}