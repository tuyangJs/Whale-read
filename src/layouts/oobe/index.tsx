
import QueueAnim from 'rc-queue-anim';
import { Button, Col, ConfigProvider, Row, Typography } from 'antd';
import lt_A from "@/assets/l_oobs-A.json"
import Lottie from "lottie-react";
import { ProCard } from '@ant-design/pro-components';
import Modal from '@/pages/diydemo/Modal'
import { useState } from 'react';
import React from 'react';
const { Title, Text } = Typography;
const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
function Animation() {
    return (
        <Lottie
            loop
            animationData={lt_A}
            style={{ width: 'inherit', height: '100%' }}

        />
    )
}
const options = {
    title: '请选择书库数据目录',
    buttonLabel: '确认',
    properties: ['openDirectory', 'openFile']
}
const msgkey = 'oobesjzi7wf'
export default (props: { openMsg: any, visible: boolean }) => {
    const [visible, setVisible] = useState(props.visible)
    const { openMsg } = props
    function setBookg() {
        openMsg({
            key: msgkey,
            type: 'loading',
            content: '请选择书库数据目录',
            duration: 0,
        })
        //@ts-ignore 打开系统对话框
        Hive.osdialog('showOpenDialog', options).then((result) => {
            if (result.canceled) {
                openMsg({
                    key: msgkey,
                    type: 'info',
                    content: '取消书库数据操作',
                    duration: 4,
                })
            } else {
                const bookfiles = result.filePaths[0]
                if (Hive.filedata('BookFile', bookfiles) === bookfiles) {
                    openMsg({
                        key: msgkey,
                        type: 'success',
                        content: '书库建立成功，请等待程序重启...',
                        duration: 4,
                    })
                    setTimeout(() => {
                        location = location
                    }, 3000);
                } else {
                    openMsg({
                        key: msgkey,
                        type: 'error',
                        content: '书库建立失败！',
                        duration: 4,
                    })
                }
            }
        })
    }
    return (

        <Modal
            width={800}
            onCancel={() => setVisible(false)}
            open={visible}
            afterClose={() => {
                location = location
            }}
            closeIcon={false}
            maskClosable={false}
            keyboard={false}
            footer={false}
            destroyOnClose
        >
            <Row>
                <Col span={8}>
                    <QueueAnim type='scale' style={{ width: 'inherit', height: '100%' }} delay={380}>
                        <div style={{ width: 'inherit', height: '100%' }} key='a'>
                            <Animation />
                        </div>
                    </QueueAnim>

                </Col>
                <Col span={16}>
                    <div style={{ width: 'inherit', height: '100%' }} key='a'>
                        <div style={{
                            margin: '10px 40px',
                            gap: 10,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Title level={2}>欢迎使用 <a style={{ filter: 'blur(8px)' }}>鲸阅言文</a></Title>
                            <Text>
                                这是一款开放式阅读与写作为一体的程序，您可以安装或开发插件，来让本程序使用更加顺心。
                            </Text>
                            <ProCard title="创建新书库" onClick={setBookg} hoverable bordered>
                                选择一个空文件夹作为您的新书库
                            </ProCard>
                            <ProCard title="打开已有书库文件" hoverable bordered>
                                如果之前您使用本程序已经创建书库文件，现在可以选择它
                            </ProCard>
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal >
    );
}
