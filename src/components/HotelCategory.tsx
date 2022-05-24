import {Button, Form, Input, InputNumber, message, Row, Table, Tooltip} from "antd";
import React, {createContext, useEffect, useState} from "react";
import type {TableRowSelection} from 'antd/lib/table/interface';
import type {ColumnsType} from 'antd/lib/table';
import {IHotelCategoryDataType, IHotelCategoryQuery, IModalVisible, IPage} from "../interfaces/Interface";
import {PlusOutlined, MinusOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons';
import HotelCategoryModal from "./HotelCategoryModal";
import {QueryHotelCategoryListApi} from "../request/api";
import {useNavigate} from "react-router-dom";
import {dateFormat, FormatsEnums} from "../utils/DateUtils";

export const HotelCategoryModalVisible = createContext<any>(null);

export default function HotelCategory() {

    const navigate = useNavigate();

    const [modalVisible, setModalVisible] = useState<IModalVisible>({key: 0, ids: [], visible: false});
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [hotelCategoryList, setHotelCategoryList] = useState<IHotelCategoryDataType[]>([]);
    const [hotelCategoryParams, setHotelCategoryParams] = useState<IHotelCategoryQuery>(
        {pageIndex: 1, pageSize: 10}
    );
    const [selectedHotelCategoryIds, setSelectedHotelCategoryIds] = useState<React.ReactNode[]>([]);
    const [searchLoading, setSearchLoading] = useState<boolean>(true);
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


    const columns: ColumnsType<IHotelCategoryDataType> = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '层级',
            dataIndex: 'level',
            key: 'level'
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
        {
            title: '上次更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        }
    ];

    const rowSelection: TableRowSelection<IHotelCategoryDataType> = {
        onChange: (selectedRowKeys) => {
            setSelectedHotelCategoryIds(selectedRowKeys);
        }
    };

    const openModal = (index: number) => {
        if (index === 1) {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = true;
                return newLoadings;
            });
            setModalVisible({key: index, visible: true});
        } else if (index === 3) {
            if (selectedHotelCategoryIds.length > 1) {
                message.warn("编辑时只能选中一条分类！").then();
            } else if (selectedHotelCategoryIds.length < 1) {
                message.warn("请选中一条分类！").then();
            } else {
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = true;
                    return newLoadings;
                });
                setModalVisible({key: index, visible: true, ids: selectedHotelCategoryIds});
            }
        } else if (index === 2) {
            if (selectedHotelCategoryIds.length < 1) {
                message.warn("请选中一条或多条分类！").then();
            } else {
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = true;
                    return newLoadings;
                });
                setModalVisible({key: index, visible: true, ids: selectedHotelCategoryIds});
            }
        }
    };

    const onQueryHotelCategoryList = (params: IHotelCategoryQuery) => {
        setSearchLoading(true);
        QueryHotelCategoryListApi(params).then((res: any) => {
            res.records.forEach((item: any) => {
                item.createTime = dateFormat(item.createTime, FormatsEnums.YMDHIS);
                item.updateTime = dateFormat(item.updateTime, FormatsEnums.YMDHIS);
                item.key = item.id;
                if (item.children) {
                    item.children.forEach((child: any) => {
                        child.createTime = dateFormat(child.createTime, FormatsEnums.YMDHIS);
                        child.updateTime = dateFormat(child.updateTime, FormatsEnums.YMDHIS);
                        child.key = child.id;
                    })
                }
            })
            setSearchLoading(false);
            setPagination(res);
            setHotelCategoryList(res.records);
        }).catch((err: any) => {
            if (err.response.status === 401) {
                message.error("用户信息过期或不合法！请重新登录！", 1)
                    .then(() => navigate("/login"));
            } else {
                message.error("查询失败：" + err.response.data, 1).then();
            }
        })
    }

    useEffect(() => {
        if (!modalVisible.visible) {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[modalVisible.key] = false;
                return newLoadings;
            });
            onQueryHotelCategoryList(hotelCategoryParams);
        }
    }, [modalVisible, hotelCategoryParams, navigate])

    const [form] = Form.useForm();

    const onSearchFinish = (searchParams: IHotelCategoryQuery) => {
        setSearchLoading(true);
        searchParams.pageIndex = hotelCategoryParams.pageIndex;
        searchParams.pageSize = hotelCategoryParams.pageSize;
        setHotelCategoryParams(searchParams);
    }

    return (
        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
            <Button
                type="primary"
                icon={<PlusOutlined/>}
                loading={loadings[1]}
                onClick={() => openModal(1)}
                style={{marginRight: "20px"}}
            >
                新增分类
            </Button>
            <HotelCategoryModalVisible.Provider value={{modalVisible, setModalVisible}}>
                <HotelCategoryModal/>
            </HotelCategoryModalVisible.Provider>
            <Button
                type="primary"
                icon={<MinusOutlined/>}
                loading={loadings[2]}
                onClick={() => openModal(2)}
                style={{marginRight: "20px"}}
            >
                删除分类
            </Button>
            <Button
                type="primary"
                icon={<EditOutlined/>}
                loading={loadings[3]}
                onClick={() => openModal(3)}
            >
                编辑分类
            </Button>
            <div style={{float: "right"}}>
                <Form layout="horizontal"
                      form={form}
                      onFinish={onSearchFinish}
                >
                    <Row>
                        <Form.Item name="name">
                            <Input placeholder="分类名称" style={{width: "130px", marginRight: "10px"}} allowClear/>
                        </Form.Item>
                        <Form.Item name="sort">
                            <InputNumber addonBefore="+" min={1} style={{width: "130px", marginRight: "10px"}} placeholder="分类排序"/>
                        </Form.Item>
                        <Form.Item>
                            <Tooltip title="搜索">
                                <Button type="primary" htmlType="submit" shape="circle" icon={<SearchOutlined/>} loading={searchLoading}/>
                            </Tooltip>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
            <Table
                loading={searchLoading}
                columns={columns}
                rowSelection={{...rowSelection}}
                dataSource={hotelCategoryList}
                style={{marginTop: "20px"}}
                locale={{emptyText: "暂无数据"}}
                pagination={{
                    showTotal: (total: number) => `共 ${total} 条`,
                    style: {marginTop: "45px"},
                    onChange: (page: number) => {
                        hotelCategoryParams.pageIndex = page;
                        setHotelCategoryParams(hotelCategoryParams);
                        onQueryHotelCategoryList(hotelCategoryParams);
                    },
                    defaultCurrent: 1,
                    pageSize: pagination.size,
                    total: pagination.total
                }}
            />
        </div>
    )
}