import {useContext, useEffect, useState} from "react";
import {HotelCategoryModalVisible} from "./HotelCategory";
import {Button, Divider, Form, Input, InputNumber, message, Modal, Select, Space} from "antd";
import TextArea from "antd/es/input/TextArea";
import "../less/HotelCategoryModal.less"
import {IHotelCategory} from "../interfaces/Interface";
import {
    CreateOrUpdateHotelCategoryApi,
    DeleteHotelCategoryByIdsApi,
    QueryHotelCategoryByIdApi,
    QueryHotelCategoryLevel1ListApi
} from "../request/api";
import {useNavigate} from "react-router-dom";

export default function HotelCategoryModal() {

    const navigate = useNavigate();

    const {Option} = Select;

    const layout = {
        labelCol: {span: 6},
        wrapperCol: {span: 16},
    };

    const [form] = Form.useForm();

    const {modalVisible, setModalVisible} = useContext(HotelCategoryModalVisible);

    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [parentVisible, setParentVisible] = useState<boolean>(false);
    const [parentDropdownList, setParentDropdownList] = useState<any[]>([]);

    useEffect(() => {
        if (modalVisible.key === 1) {
            setTitle("新增分类");
            setParentVisible(false);
        } else if (modalVisible.key === 3 && modalVisible.ids) {
            setTitle("编辑分类");
            QueryHotelCategoryByIdApi("/" + modalVisible.ids[0]).then((res: any) => {
                form.setFieldsValue(res);
                if (res.level === 2) {
                    setParentVisible(true);
                }
            })
        } else if (modalVisible.key === 2 && modalVisible.ids) {
            setTitle("删除分类");
        }
    }, [modalVisible, form])

    useEffect(() => {
        if (parentVisible) {
            let tempArr: any[] = [];
            QueryHotelCategoryLevel1ListApi().then((res: any) => {
                res.forEach((item: any) => {
                    tempArr.push(<Option key={item.id}>{item.name}</Option>);
                });
                setParentDropdownList(tempArr);
            })
        }
    }, [parentVisible, Option])

    const handleCancel = (key: number) => {
        form.resetFields();
        setModalVisible({key: key, id: "", visible: false});
    }

    const formOnFinish = (hotelCategory: IHotelCategory) => {
        setLoading(true);
        if (modalVisible.key === 1) {
            CreateOrUpdateHotelCategoryApi(hotelCategory).then(() => {
                message.success("新增分类成功！", 1).then(() => {
                    form.resetFields();
                    setLoading(false);
                    handleCancel(modalVisible.key);
                });
            }).catch((err: any) => {
                if (err.response.status === 401) {
                    message.error("用户信息过期或不合法！请重新登录！", 1)
                        .then(() => navigate("/login"));
                } else {
                    message.error("新增失败：" + err.response.data, 1).then();
                }
                setLoading(false);
            })
        } else if (modalVisible.key === 3) {
            hotelCategory.id = modalVisible.ids[0];
            CreateOrUpdateHotelCategoryApi(hotelCategory).then(() => {
                message.success("修改分类成功！", 1).then(() => {
                    form.resetFields();
                    setLoading(false);
                    handleCancel(modalVisible.key);
                });
            }).catch((err: any) => {
                if (err.response.status === 401) {
                    message.error("用户信息过期或不合法！请重新登录！", 1)
                        .then(() => navigate("/login"));
                } else {
                    message.error("修改失败：" + err.response.data, 1).then();
                }
                setLoading(false);
            })
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    const selectLevelOnChange = (value: string) => {
        if (value === "2") {
            setParentVisible(true);
        } else {
            setParentVisible(false);
        }
    }

    const deleteOnClick = () => {
        setLoading(true);
        DeleteHotelCategoryByIdsApi(modalVisible.ids).then(() => {
            message.success("删除成功！").then();
            form.resetFields();
            setLoading(false);
            handleCancel(modalVisible.key);
        }).catch((err: any) => {
            message.error("删除失败：" + err.response.data).then();
            setLoading(false);
        });
    }

    return (
        <Modal visible={modalVisible.visible}
               title={title}
               cancelText="取消"
               okText="确定"
               onCancel={() => handleCancel(modalVisible.key)}
               footer={null}>
            {
                modalVisible.key === 2
                    ?
                    (
                        <div>
                            <p style={{fontSize: "19px"}}>注意！<br/> <br/>
                                删除分类会导致已被赋予该分类的酒店消失该分类！<br/> <br/>
                                若所选的分类为顶级分类，则会导致子分类一起删除！
                            </p>
                            <div style={{marginTop: "80px", float: "right"}}>
                                <Button style={{marginRight: "10px"}} key="back"
                                        onClick={() => handleCancel(modalVisible.key)}>
                                    取消
                                </Button>
                                <Button type="primary" onClick={deleteOnClick} loading={loading}>
                                    确定
                                </Button>
                            </div>
                        </div>
                    )
                    :
                    (
                        <Form {...layout} form={form} name="control-hooks" onFinish={formOnFinish}>
                            <Form.Item name="name" label="分类名称" rules={[{required: true, message: "请输入分类名称！"}]}>
                                <Input allowClear/>
                            </Form.Item>
                            <Form.Item name="level" label="分类层级" rules={[{required: true, message: "请选择分类层级！"}]}>
                                <Select
                                    placeholder="请选择一个分类层级"
                                    allowClear
                                    onChange={selectLevelOnChange}
                                >
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                </Select>
                            </Form.Item>
                            {
                                parentVisible
                                    ? (
                                        <Form.Item name="parentId" label="父层级"
                                                   rules={[{required: true, message: "请选择父层级！"}]}>
                                            <Select
                                                placeholder="请选择一个父层级"
                                                allowClear
                                            >
                                                {parentDropdownList}
                                            </Select>
                                        </Form.Item>
                                    ) : ""
                            }
                            <Form.Item name="sort" label="分类排序" rules={[{required: true, message: "请输入分类排序！"}]}>
                                <InputNumber addonBefore="+" min={1} style={{width: "315px"}}/>
                            </Form.Item>
                            <Form.Item name="description" label="分类描述">
                                <TextArea rows={1} allowClear/>
                            </Form.Item>
                            <Divider/>
                            <Space style={{float: "right"}}>
                                <Form.Item>
                                    <Button key="back" onClick={() => handleCancel(modalVisible.key)}>
                                        取消
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button key="reset" type="primary" onClick={onReset}>
                                        重置
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        确定
                                    </Button>
                                </Form.Item>
                            </Space>
                        </Form>
                    )
            }
        </Modal>
    )
}