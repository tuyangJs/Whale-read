import Modal from '@/pages/diydemo/Modal'
import React, { memo, useEffect } from 'react';
interface Props {
    open: boolean,
    setOpen: any,
    openMsg: any,
    Filel: any[],
    callBack: (key: string,Filel:any[]) => void,
}
import { Button, Col, List, Row, Select } from 'antd';
import NewGroup from '@/pages/setweb/New Group';
let selected = ''

interface tab {
    value: string;
    label: string
}
const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label || '').toLowerCase().includes(input.toLowerCase());

const App: React.FC<Props> = ({ open, callBack, Filel, setOpen, openMsg }) => {
    const [bookGroup, setbookGroup] = React.useState<tab[]>([]);
    const [status, setstatus] = React.useState<"" | "warning" | "error" | undefined>(undefined);
    const [newgroupShow, setnewgroupShow] = React.useState<boolean>(false);
    const onChange = (value: string) => {
        selected = value
        setstatus('')
    };
    React.useEffect(() => {
        Hive.getGroup((data: string[]) => {
            const sitem: tab[] = [];
            try {
                data.forEach((key: string, i: number) => {
                    sitem.push({
                        value: i.toString(),
                        label: key
                    });
                });
            } catch (error) {
                // 处理错误
            } finally {
                setbookGroup(sitem);
            }
        });
    }, [])
    var data: string[] = []
    Filel.forEach(key => {
        data.push(key.name)
    })
    return (<Modal
        open={open}
        width={410}
        maskClosable={true}
        title="选择书架分组"
        okText='确认'
        onOk={() => {
            if(!selected){
                setstatus('error')
               return
            }
            callBack(selected,Filel) }}
        onCancel={() => { setOpen(false) }}

    >
        <List
            bordered
            style={{ marginBottom: 12 }}
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    {item}
                </List.Item>
            )}
        />
        <Row gutter={6}>
            <Col span={16}>
                <Select
                    status = {status}
                    style={{ width: '100%' }}
                    showSearch
                    placeholder="点击选择分组"
                    optionFilterProp="children"
                    onChange={onChange}
                    filterOption={filterOption}
                    options={bookGroup}
                />
            </Col>

            <Col span={8}>
                <Button onClick={() => {
                    setnewgroupShow(true)
                }}>创建分组</Button>
            </Col>

            <NewGroup
                openMsg={openMsg}
                open={newgroupShow}
                setOpen={setnewgroupShow}
                onCreate={() => {
                    Hive.getGroup((data: []) => {
                        const defaultData: { label: string; value: string; }[] = []
                        data.map((key: string, i: number) => {
                            defaultData.push({
                                value: i.toString(),
                                label: key
                            })
                        })
                        setbookGroup(defaultData)
                    })
                }} />
        </Row>
    </Modal>)
}

export default memo(App)