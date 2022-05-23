import {Button, message, Table, Tooltip} from "antd";
import React, {createContext, useEffect, useState} from "react";
import type {TableRowSelection} from 'antd/lib/table/interface';
import type {ColumnsType} from 'antd/lib/table';
import {IHotelCategoryDataType, IHotelCategoryQuery, IModalVisible} from "../interfaces/Interface";
import {PlusOutlined, MinusOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons';
import HotelCategoryModal from "./HotelCategoryModal";
import {QueryHotelListApi} from "../request/api";
import {useNavigate} from "react-router-dom";
import {dateFormat, FormatsEnums} from "../utils/DateUtils";

export const HotelCategoryModalVisible = createContext<any>(null);

export default function HotelCategory() {

    const navigate = useNavigate();

    const [modalVisible, setModalVisible] = useState<IModalVisible>({key: 0, id: "", visible: false});
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [hotelCategoryList, setHotelCategoryList] = useState<IHotelCategoryDataType[]>([]);
    const [hotelCategoryParams, setHotelCategoryParams] = useState<IHotelCategoryQuery>(
        {pageIndex: 1, pageSize: 10}
    );

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
            title: '当前排位',
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
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };

    const openModal = (index: number) => {
        setModalVisible({key: index, visible: true});
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    };

    useEffect(() => {
        if (!modalVisible.visible) {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[modalVisible.key] = false;
                return newLoadings;
            });
            QueryHotelListApi(hotelCategoryParams).then((res: any) => {
                res.records.map((item: any) => {
                    item.createTime = dateFormat(item.createTime, FormatsEnums.YMDHIS);
                    item.updateTime = dateFormat(item.updateTime, FormatsEnums.YMDHIS);
                })
                setHotelCategoryList(res.records);
            }).catch((err: any) => {
                if (err.response.status == 401) {
                    message.error("用户信息过期或不合法！请重新登录！", 1)
                        .then(() => navigate("/login"));
                } else {
                    message.error("查询失败：" + err.response.data, 1).then();
                }
            })
        }
    }, [modalVisible])

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
                <Tooltip title="搜索">
                    <Button type="primary" shape="circle" icon={<SearchOutlined/>}/>
                </Tooltip>
            </div>
            <Table
                columns={columns}
                rowSelection={{...rowSelection}}
                dataSource={hotelCategoryList}
                style={{marginTop: "20px"}}
            />
        </div>
    )
}