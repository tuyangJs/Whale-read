import React, { useState } from 'react';
import {  Button ,Table} from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

interface DataItem {
    key: number;
    name: string;
    age: number;
    address: string;
}

const TableContext = React.createContext(false);
const TableEnterLeave: React.FC = () => {
   
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text: any, record: DataItem) => (
                <span onClick={() => onDelete(record.key)}>Delete</span>
            ),
        },
    ];
    const onEnd = (e: any) => {
        const dom = e.target;
        dom.style.height = 'auto';
    };

    const enterAnim = [
        {
            opacity: 0,
            x: 30,
            backgroundColor: '#fffeee',
            duration: 0,
        },
        {
            height: 0,
            duration: 200,
            type: 'from',
            delay: 250,
            ease: 'easeOutQuad',
            onComplete: onEnd,
        },
        {
            opacity: 1,
            x: 0,
            duration: 250,
            ease: 'easeOutQuad',
        },
        { delay: 1000, backgroundColor: '#fff' },
    ];

    const pageEnterAnim = [
        {
            opacity: 0,
            duration: 0,
        },
        {
            height: 0,
            duration: 150,
            type: 'from',
            delay: 150,
            ease: 'easeOutQuad',
            onComplete: onEnd,
        },
        {
            opacity: 1,
            duration: 150,
            ease: 'easeOutQuad',
        },
    ];

    const leaveAnim = [
        { duration: 250, opacity: 0 },
        { height: 0, duration: 200, ease: 'easeOutQuad' },
    ];

    const pageLeaveAnim = [
        { duration: 150, opacity: 0 },
        { height: 0, duration: 150, ease: 'easeOutQuad' },
    ];

    const data: DataItem[] = [
        {
            key: 1,
            name: 'John Brown',
            age: 32,
            address: 'New York No.1 Lake Park',
        },
        {
            key: 2,
            name: 'Jim Green',
            age: 42,
            address: 'London No.1 Lake Park',
        },
        {
            key: 3,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No.1 Lake Park',
        },
        {
            key: 4,
            name: 'Jim Red',
            age: 18,
            address: 'London No.1 Lake Park',
        },
    ];

    const [dataList, setDataList] = useState(data);
    const [isPageTween, setIsPageTween] = useState(false);


    const onAdd = () => {
        const i = Math.round(Math.random() * (data.length - 1));
        const newData = {
            key: Date.now(),
            name: data[i].name,
            age: data[i].age,
            address: data[i].address,
        };
        setDataList([newData, ...dataList]);
        setIsPageTween(false);
    };

    const onDelete = (key: number) => {
        const newData = dataList.filter((item) => item.key !== key);
        setDataList(newData);
        setIsPageTween(false);
    };

    const pageChange = () => {
        setIsPageTween(true);
    };

    const animTag: React.FC = ($props: any) => (
        <TableContext.Consumer>
            {(isPageTween) => (
                <TweenOneGroup
                      component="tbody"
                      enter={!isPageTween ? enterAnim : pageEnterAnim}
                      leave={!isPageTween ? leaveAnim : pageLeaveAnim}
                      appear={false}
                      exclusive
                      {...$props}
                  /> 
            )}
        </TableContext.Consumer>
    );
    return (
        <div>
            <div className={`table-enter-leave-demo-action-bar`}>
                <Button type="primary" onClick={onAdd}>
                    Add
                </Button>
            </div>
            <TableContext.Provider value={isPageTween}>
                <Table
                    columns={columns}
                    pagination={{ pageSize: 4 }}
                    dataSource={dataList}
                    //components={{ body: { wrapper: animTag } }}
                    onChange={pageChange}
                />
            </TableContext.Provider>
        </div>
    );
};

export default TableEnterLeave;
