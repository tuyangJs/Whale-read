import { Button, Typography, ColorPicker, ConfigProvider, Form, Card, Row, Col, Switch, message, Tag, Collapse, theme } from 'antd';
import React from 'react';
import { useOutletContext } from 'umi';
import type { Color } from 'antd/es/color-picker';
import { ReactComponent as Lightico } from '@/assets/light.svg'
import { ReactComponent as Aotuico } from '@/assets/aotu.svg'
import Groop from './grouping'
import QueueAnim from 'rc-queue-anim';
import { CheckCard } from '@ant-design/pro-components';
import { HappyProvider } from '@ant-design/happy-work-theme';
import typeface from './typeface';
import NewGroup from './New Group';
import type { DataNode } from 'antd/es/tree';
const { Title, Text } = Typography;
type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
    colorlet: string[],
    theme: number,
}

const items = [
    {
        label: '浅色',
        icon: <Lightico style={{
            color: '#DCDCDC', borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#71717170',
            borderRadius: 2
        }} />,
        key: 1,
    },
    {
        label: '深色',
        icon: <Lightico style={{
            color: '#2B2B2B', borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#71717170',
            borderRadius: 2
        }} />,
        key: 2,
    },
    {
        label: '自动',
        icon: <Aotuico style={{
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#71717170',
            borderRadius: 2
        }} />,
        key: 3,
    }
];

export default function set() {
    const layoutContext: any = useOutletContext();
    const [form] = Form.useForm();
    //颜色预设
    const colors = [{
        label: '推荐颜色',
        colors: [
            '#F5222D',
            '#FA8C16',
            '#FADB14',
            '#8BBB11',
            '#52C41A',
            '#13A8A8',
            '#1677FF',
            '#2F54EB',
            '#722ED1',
            '#EB2F96',
        ],
    }]

    const colo = Hive.filedata('colorlet')
    const defaultData: ThemeData = {
        borderRadius: 6,
        colorPrimary: layoutContext.userColor,
        colorlet: colo,
        theme: 0,
    };
    const [data, setData] = React.useState<ThemeData>(defaultData)
    const newcolor = (cdata: string[]) => { //保存曾用色
        cdata.map((key, i) => {
            if (i > 0 && key == cdata[0]) {
                cdata.splice(i, 1)
            }
        })
        if (cdata.length > 30) {
            for (let i = 0; i < (cdata.length - 30); i++) {
                cdata.pop()
            }
        }
        Hive.filedata('colorlet', cdata)
        setData({
            ...data,
            colorlet: cdata
        })
    }
    if (data?.colorlet?.length > 0) {
        colors.push({
            label: '曾用颜色',
            colors: data.colorlet
        })
    } else {
        colors.splice(1, 1)
    }
    //@ts-ignore 背景效果
    const backdrops = (Hive.filedata('backdrop') == undefined) ? true : Hive.filedata('backdrop')
    const [backdrop, setBackdrop] = React.useState<boolean>(backdrops)
    // 主题设置
    const {ifoDack,setifoDack} = layoutContext
    const onClick: (checkedValue: any) => void = async (key) => {
        await Hive.filedata('ifoDack', key)
        setTimeout(() => {
            setifoDack(key, backdrop)
        }, 50)
    }
    const [newgroupShow, setnewgroupShow] = React.useState<boolean>(false)
    //书架文件位置
    const BookFiles = Hive.filedata('BookFile')
    const [BookFile, netBookFile] = React.useState<string>(BookFiles ? BookFiles : '')
    const options = {
        title: '请选择新的书库数据目录',
        buttonLabel: '更改',
        properties: ['openDirectory', 'openFile']
    }
    const { openMsg } = layoutContext
    function setBookFile() {
        const msgkey = 'bookFileSet,'
        openMsg({
            key: msgkey,
            type: 'loading',
            content: '请选择新的书库数据目录',
            duration: 0,
        })
        //@ts-ignore 打开系统对话框
        Hive.osdialog('showOpenDialog', options).then((result) => {
            if (result.canceled) {
                openMsg({
                    key: msgkey,
                    type: 'info',
                    content: '取消导入书籍',
                    duration: 4,
                })
            } else {
                const bookfiles = result.filePaths[0]
                if (BookFile === bookfiles) {
                    openMsg({
                        key: msgkey,
                        type: 'warning',
                        content: '书库目录没有更改',
                        duration: 4,
                    })
                    return
                }
                netBookFile(bookfiles)
                if (Hive.filedata('BookFile', bookfiles) === bookfiles) {
                    openMsg({
                        key: msgkey,
                        type: 'success',
                        content: '更改成功，旧数据需要自己转移',
                        duration: 4,
                    })
                } else {
                    openMsg({
                        key: msgkey,
                        type: 'error',
                        content: '更改目录失败！',
                        duration: 4,
                    })
                }
            }
        })
    }
    //分组管理
    const [gupData, setgupData] = React.useState<DataNode[]>([])
    Hive.getGroup((data: any) => {
        const defaultData: DataNode[] = []
        try {
            data.map((key: string, i: number) => {
                defaultData.push({
                    key: i,
                    title: key
                })
            })
        } catch (error) {

        } finally {
            React.useEffect(() => {
                setgupData(defaultData)
            }, []
            )
        }
    })

    const [messageApi, contextHolder] = message.useMessage()
    const setTypeface = layoutContext.setTypeface //字体设置
    //字体设置组件
    console.log(ifoDack);
    
    const { Typeface, typefaceName } = typeface()
    return (

        <div style={{ paddingBottom: 8 }}>
            <ConfigProvider
                theme={{ token: { colorPrimary: data.colorPrimary, borderRadius: data.borderRadius } }}
            >
                {contextHolder}
                <Form

                    form={form}
                    labelAlign='left'
                    onValuesChange={(changedValues, allValues) => {
                        const colorObj = changedValues?.colorPrimary
                            ? { colorPrimary: (allValues?.colorPrimary as Color)?.toHexString() }
                            : {};
                        setData({
                            ...data,
                            ...allValues,
                            ...colorObj,
                        });
                    }}
                    name="theme"
                    initialValues={defaultData}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <QueueAnim type='right' delay={10} style={{
                        gap: 8,
                        display: 'grid',
                        alignItems: 'start'
                    }}>
                        <Title key='a' style={{ marginTop: 0 }} level={4}>
                            个性化
                        </Title>
                        <Card key='b' style={{ padding: ' 8px 16px' }}>
                            <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                                <Row justify="space-around" align="middle">
                                    <Col flex={'auto'}>
                                        <Form.Item style={{ marginBottom: 0, width: 500 }}
                                            valuePropName="color"
                                            name="colorPrimary"
                                            label="主题颜色"
                                            extra="设置后可在本页面预览，鼠标放在可互动组件查看效果"
                                        >
                                            <ColorPicker disabledAlpha presets={colors} showText={true} />
                                        </Form.Item>
                                    </Col>
                                    <Col flex={'0 1 aotu'}>
                                        <HappyProvider >
                                            <Button type="primary"
                                                onClick={() => {
                                                    if (data?.colorlet == undefined) data.colorlet = []
                                                    if (data.colorPrimary == data?.colorlet[0]) return
                                                    const newdata = data.colorlet
                                                    newdata.unshift(data.colorPrimary)
                                                    newcolor(newdata)
                                                    layoutContext.setTheme(data.colorPrimary)
                                                    messageApi.open({
                                                        type: 'success',
                                                        content: '主题色应用成功！',
                                                        key: 'backdropcolor'
                                                    })
                                                }}
                                            >应用</Button>
                                        </HappyProvider>
                                    </Col>
                                </Row>
                            </Card.Grid>
                        </Card>
                        <Card key='c' style={{ padding: ' 8px 16px' }}>
                            <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                                <Row justify="space-around" align="middle">
                                    <Col flex={'auto'}>
                                        <Text>
                                            程序主题：
                                        </Text>
                                    </Col>
                                    <Col flex={'0 1 aotu'}>
                                        <CheckCard.Group
                                            onChange={onClick}
                                            defaultValue={ifoDack}
                                        >
                                            {
                                                items.map((data) => {
                                                    return (
                                                        <CheckCard title={data.label} value={data.key}
                                                            style={{ width: 118 }}
                                                            cover={
                                                                <div className="c01349">
                                                                    {data.icon}
                                                                    <div><label> {data.label} </label></div></div>
                                                            } />
                                                    )
                                                })
                                            }
                                        </CheckCard.Group>
                                    </Col>
                                </Row>
                            </Card.Grid>
                        </Card>
                        <Card key='d' style={{ padding: ' 8px 16px' }}>
                            <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                                <Row justify="space-around" align="middle">
                                    <Col flex={'auto'}>
                                        <Text>
                                            背景效果：
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            <Tag bordered={false} color='cyan'>
                                                亚克力
                                            </Tag>
                                            采样窗口后的背景，

                                            <Tag bordered={false} color='purple'>
                                                云母
                                            </Tag>采样桌面壁纸，节省资源占用
                                        </Text>
                                    </Col>
                                    <Col flex={'0 1 aotu'}>
                                        <Tag bordered={false} color={backdrop ? 'cyan' : 'purple'}>
                                            {backdrop ? '亚克力' : '云母'}
                                        </Tag>
                                    </Col>
                                    <Col flex={'0 1 aotu'}>
                                        <HappyProvider>
                                            <Switch defaultChecked checked={backdrop} onChange={(err) => {
                                                Hive.filedata('backdrop', err)
                                                setBackdrop(err)
                                                openMsg({
                                                    key: 'maic_aqsfz',
                                                    type: 'success',
                                                    content: '更改成功，重启程序后生效！',
                                                })
                                            }} />
                                        </HappyProvider>
                                    </Col>
                                </Row>
                            </Card.Grid>
                        </Card>
                        <Card key='e' style={{ padding: ' 8px 16px' }}>
                            <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                                <Row justify="space-around" style={{ gap: 10 }} align="middle">
                                    <Col flex={'auto'}>
                                        <Text>
                                            程序字体：
                                        </Text>
                                        <br />
                                        <Text
                                            style={{ fontFamily: `${typefaceName.values[typefaceName.values.length - 1]}` }}
                                            type="secondary">
                                            字体预览：{
                                                typefaceName.sop.map((key: any, i: number) => {
                                                    let texta = (i === 0) ? key.label : ` - ${key.label}`
                                                    return texta
                                                })}
                                        </Text>
                                    </Col>
                                    <Col flex={'0 1 aotu'}>
                                        <Typeface />
                                    </Col>
                                    <Col flex={'0 1 aotu'}>
                                        <HappyProvider >
                                            <Button onClick={() => {
                                                Hive.filedata('typeface', typefaceName)
                                                setTypeface(typefaceName)
                                            }}>
                                                应用
                                            </Button>
                                        </HappyProvider>
                                    </Col>
                                </Row>
                            </Card.Grid>
                        </Card>
                        <Title key='f' level={4}>
                            书架
                        </Title>
                        <Card key='g' style={{ padding: ' 8px 16px' }}>
                            <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                                <Row justify="space-around" align="middle">
                                    <Col flex={'auto'}>
                                        <Text>
                                            书库位置：
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            {BookFile}
                                        </Text>
                                    </Col>
                                    <Col flex={'0 1 aotu'}>
                                        <Button onClick={setBookFile}>更改位置</Button>
                                    </Col>
                                </Row>
                            </Card.Grid>
                        </Card>
                        <Card style={{ padding: ' 0px 10px' }} key='h'>
                            <Card.Grid style={{ padding: '8px 0px', width: '100%', boxShadow: 'none' }}>
                                <Collapse items={[
                                    {
                                        key: '1',
                                        label: <span className="ant-typography ">书架分组：</span>,
                                        children: <Groop openMsg={openMsg} gupData={gupData} setgupData={setgupData} />,
                                    }
                                ]}
                                    style={{ background: 'transparent' }}
                                    ghost={true}
                                    expandIconPosition='end'
                                />
                                <Button style={{
                                    position: 'fixed',
                                    right: 50,
                                    top: 15,
                                }
                                } onClick={() => {
                                    setnewgroupShow(true)
                                }}>创建分组</Button>
                                <NewGroup
                                    openMsg={openMsg}
                                    open={newgroupShow}
                                    setOpen={setnewgroupShow}
                                    onCreate={() => {
                                        Hive.getGroup((data: []) => {
                                            const defaultData: DataNode[] = []
                                            data.map((key: string, i: number) => {
                                                defaultData.push({
                                                    key: i,
                                                    title: key
                                                })
                                            })
                                            setgupData(defaultData)
                                        })
                                    }} />
                            </Card.Grid>
                        </Card>
                    </QueueAnim>
                </Form>

            </ConfigProvider>
        </div >
    );
};