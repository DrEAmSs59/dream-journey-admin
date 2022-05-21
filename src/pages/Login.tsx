import "../less/Login.less";
import {Form, Input, Button, message} from 'antd';
import {ILogin} from "../interfaces/Interface";
import {AdminLoginApi} from "../request/api";
import {useNavigate} from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const onLogin = (values: ILogin) => {
        AdminLoginApi(values).then((res: any) => {
            message.success("登陆成功！", 1)
                .then(() => {
                    localStorage.setItem("token", res);
                    navigate("/");
                });
        }).catch((err: any) => {
            message.error("登陆失败：" + err.response.data, 2)
                .then(() => localStorage.clear());
        })
    };

    return (
        <div className="background">
            <div className="login-box">
                <div className="login-header">
                    管理员登录
                </div>
                <div className="login-form">
                    <Form
                        name="basic"
                        labelCol={{span: 5}}
                        wrapperCol={{span: 16}}
                        onFinish={onLogin}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{required: true, message: '请输入用户名！'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入密码！'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 5, span: 16}}>
                            <Button type="primary" htmlType="submit" block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}