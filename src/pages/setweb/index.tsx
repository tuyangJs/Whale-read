import { Button, Typography, ColorPicker, ConfigProvider, Form, Switch, message, Tag, Collapse } from 'antd';
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
import Card from './Card';
import type { DataNode } from 'antd/es/tree';
const { Title, Text } = Typography;
type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
    colorlet: string[],
    theme: number,
}
var Windows11 = false
var isdev = false
//@ts-ignore 初始化主程序函数
const getProce = () => {
    // @ts-ignore 取参数列表
    const Proce = Hive.Process
    for (let i = 0; i < Proce.length; i++) {
        const data = Proce[i];
        /* 判断win10还是win11 */
        if ('os=Win11' === data) {
            Windows11 = true
        }
    }
}
getProce()
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
    const { ifoDack, setifoDack } = layoutContext
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

    const { Typeface, Typevalue, TypefaceName } = typeface({ typefaces: Hive.filedata('typeface') })
    return (
        <div style={{ paddingBottom: 8 }}>
            <ConfigProvider
                theme={{ token: { colorPrimary: data.colorPrimary } }}
            >
                {contextHolder}

                <QueueAnim type='right'
                    duration={360}
                    interval={50}
                    delay={50} style={{
                        gap: 8,
                        display: 'grid',
                        alignItems: 'start'
                    }}>
                    <Title key='a' style={{ marginTop: 0 }} level={4}>
                        个性化
                    </Title>

                    <Card key='b' Titles='主题颜色' Pendant="设置后可在本页面预览，鼠标放在可互动组件查看效果" intro={

                        <ColorPicker onChangeComplete={(color) => setData({ ...data, colorPrimary: color.toHexString() })} disabledAlpha presets={colors} showText={true} />

                    }>


                        <HappyProvider>
                            <Button type="primary"
                                style={{ marginLeft: 8 }}
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
                    </Card>
                    <Card key='c' Titles='程序主题'>
                        <CheckCard.Group
                            onChange={onClick}
                            defaultValue={ifoDack}
                        >
                            {
                                items.map((data, i) => {
                                    return (
                                        <CheckCard key={i} title={data.label} value={data.key}
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
                    </Card>
                    <Card key='d' Titles='背景效果' intro={
                        <>
                            <Tag bordered={false} color='cyan'>
                                亚克力
                            </Tag>
                            采样窗口后的背景，

                            <Tag bordered={false} color='purple'>
                                云母
                            </Tag>采样桌面壁纸，节省资源占用
                        </>
                    }
                        Pendant={
                            <Tag bordered={false} color={backdrop ? 'cyan' : 'purple'}>
                                {backdrop ? '亚克力' : '云母'}
                            </Tag>
                        }
                    >
                        <HappyProvider>
                            <Switch defaultChecked disabled={!Windows11} checked={backdrop} onChange={(err) => {
                                Hive.filedata('backdrop', err)
                                setBackdrop(err)
                                openMsg({
                                    key: 'maic_aqsfz',
                                    type: 'success',
                                    content: '更改成功，重启程序后生效！',
                                })
                            }} />
                        </HappyProvider>
                    </Card>
                    <Card key='e'
                        Titles='程序字体'
                        intro={<> 字体预览：{TypefaceName}</>}
                        Pendant={<Typeface />}
                    >
                        <HappyProvider >
                            <Button style={{ marginLeft: 8 }} onClick={() => {
                                Hive.filedata('typeface', Typevalue)
                                setTypeface(Typevalue)
                            }}>
                                应用
                            </Button>
                        </HappyProvider>
                    </Card>
                    <Title key='f' level={4}>
                        书架
                    </Title>
                    <Card key='g' Titles='书库与数据目录' intro={BookFile}>
                        <Button onClick={setBookFile}>更改位置</Button>
                    </Card>
                    <Card key='h' DIY={true}>
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
                    </Card>
                </QueueAnim>

            </ConfigProvider>
        </div >
    );
};