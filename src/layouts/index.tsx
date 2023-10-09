import React, { memo, useEffect, useState } from 'react';
import { history, useRouteProps } from 'umi';
import { Layout, theme, ConfigProvider, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import styles from './index.less';
import Oobe from './oobe';
import HeaderBody from './Header'
import MainBody from './body'
import SiderBody from './sider'
import DevMenu from './devMenu'
import './typeface.less'
const { Header, Content, Sider } = Layout;
//@ts-ignore
document.querySelector("body").style.margin = '0'
//@ts-ignore
document.querySelector("body").style.overflow = 'hidden'


var Windows11 = false
var isdev = false
//@ts-ignore 初始化主程序函数
//夜间配色透明
const fodackTheme = {
    algorithm: [theme.darkAlgorithm,],
    token: {
        colorPrimary: '#d89614',
        colorBgLayout: '#0c0c0cc4',
        colorFillContent: '#37373794',
        colorBgContainer: '#1414148a',
        itemActiveBg: '#303030',
        itemSelectedBg: '#303030',
        itemHoverBg: '#303030',

    },
    components: {
        Menu: {
            colorBgContainer: 'transparent'
        },
        Layout: {
            headerBg: 'transparent'
        },
        Modal: {
            contentBg: '#1e1e1ee6',
            headerBg: 'none'
        },
    }
}

//浅色配色透明
const nodackTheme = {
    token: {
        colorPrimary: '#d89614',
        colorBgLayout: '#ffffffc4',
        colorFillContent: '#ffffff80',
        colorBgContainer: '#ffffff6e',
        itemActiveBg: '#303030',
        itemSelectedBg: '#303030',
        itemHoverBg: '#303030',
    },
    components: {
        Modal: {
            contentBg: '#ffffffcc',
            headerBg: 'none'
        },
    }
}
const getProce = () => {
    // @ts-ignore 取参数列表
    const Proce = Hive.Process
    for (let i = 0; i < Proce.length; i++) {
        const data = Proce[i];
        /* 判断win10还是win11 */
        if ('os=Win11' === data) {
            Windows11 = true
        }
        //是开发运行环境
        if ('isdev' === data) {
            isdev = true
        }
    }

}
getProce()
var Webwidth = window.innerWidth;
let inmt: any = Hive.filedata('ifoDack')
const intDack = parseInt(inmt ? inmt : 3)
Hive.winTheme(intDack)
const App: React.FC = () => {
    const Menuc = (Webwidth < 820 ? true : false)
    const [collapsed, setCollapsed] = useState<Boolean>(Menuc);
    //动态站点标题 
    const { name } = useRouteProps()
    //===================动态站点标题 EDM==================//>>
    //@ts-ignore 获取缓存数据
    const themeColors = Hive.filedata('themeColor') //用户配色缓存
    const [themeColor, setThemeColors] = useState(themeColors ? themeColors : '#1677FF')//用户主题预设
    //紧凑界面算法
    const [compactUi, setcompactUi] = useState(false)
    //@ts-ignore 切换主题算法
    const [ifoDack, setifoDack] = useState(intDack) //是否为深色    
    //判断主题样式
    const dataThemeui = (err: number) => {
        let cui = err
        if (err === 3) {
            cui = window.matchMedia("(prefers-color-scheme: dark)").matches ? 2 : 1
        }

        return (cui === 2) ? true : false
    }

    //渲染主题
    function setThemeui(err: boolean) {
        let algo
        if (err) {
            algo = theme.darkAlgorithm
        } else {
            algo = theme.defaultAlgorithm
        }
        let comui = compactUi ? theme.compactAlgorithm : null
        const Thmev = {
            ...fodackTheme,
            algorithm: comui ? [algo, comui] : [algo]
        }
        if (!err) {
            Thmev.token = nodackTheme.token
            Thmev.components = { ...fodackTheme.components, ...nodackTheme.components }
        }
        Thmev.token.colorPrimary = themeColor
        //@ts-ignore 适配云母效果
        if (Hive.filedata('backdrop') === false) {
            Thmev.token.colorBgLayout = 'transparent'
        }
        return Thmev
    }

    const [dackTheme, setTheme] = useState<any>(setThemeui(dataThemeui(ifoDack)))

    // @ts-ignore  自动切换主题界面
    window.autoUi = function (err: any) {
        setTheme(setThemeui(err))
    }
    const setThemeColor = (e: string) => {
        setThemeColors(e)
        setTheme({
            ...dackTheme,
            token: {
                ...dackTheme.token,
                colorPrimary: e
            }
        })
        Hive.filedata('themeColor', e) //用户配色缓存
    }
    //切换主题
    async function tabThui(err: number) {
        setifoDack(err)
        Hive.winTheme(err)
    }
    const setcompact = (comui: any) => {
        let algo = null
        if (comui) {
            algo = [...dackTheme.algorithm, theme.compactAlgorithm]
        } else {
            algo = [dackTheme.algorithm[0]]
        }
        setTheme({
            ...dackTheme,
            algorithm: algo,
        })
    }
    const handleResize = (e: any) => {
        //自适应导航栏s
        if (e.target.innerWidth < 900) {
            // console.log(e.target.innerWidth,Webwidth);
            if (Webwidth >= e.target.innerWidth) {
                Webwidth = e.target.innerWidth
                setCollapsed(true)
            }
        }
        else {
            if (e.target.innerWidth > 900) {
                if (Webwidth <= e.target.innerWidth) {
                    Webwidth = e.target.innerWidth
                    setCollapsed(false)

                }
            }
        }
    }
    try {
        //@ts-ignore 监听窗口大小改变
        Hive.onWinresize((data) => {
            setTimeout(() => {
                handleResize(data)
            }, 0);
        })
    } catch (error) {
        window.addEventListener('resize', handleResize)//监听窗口大小改变
    }
    const Menonclick = (e: any) => { //导航点击事件
        document.title = e.domEvent.target.innerText
        history.push(e.key)
    }
    //切换导航栏状态
    const TabMenu = () => {
        setCollapsed(!collapsed)
    }
    const [messageApi, contextHolder] = message.useMessage();
    messageApi.warning

    //重封装消息提示函数
    function openMsg(params: any, cllback?: () => void) {
        if (typeof params === 'string') {
            messageApi.destroy(params)
            return
        }
        return messageApi.open({
            ...params,
            style: { marginTop: '4vh' },
        }).then(cllback)
    }
    //字体设置
    let typefaces = Hive.filedata('typeface')
    const typefaced = { //字体默认配置
        "values": [
            "HarmonyOS_Sans",
            "HarmonyOS_Sans_Light"
        ],
        "sop": [
            {
                "value": "HarmonyOS_Sans",
                "label": "HarmonyOS_Sans"
            },
            {
                "label": "标准",
                "value": "HarmonyOS_Sans_Light"
            }
        ]
    }
    if (typefaces === undefined) {
        Hive.filedata('typeface', typefaced)
        typefaces = typefaced
    }
    //@ts-ignore 书库目录自检
    const ifLibrary = Hive.directorySelfTest(Hive.filedata('BookFile'))
    const [typeface, setTypeface] = React.useState(typefaces)
    //=======初始化完成===========》》
    return (
        <ConfigProvider
            theme={{
                algorithm: dackTheme.algorithm,
                token: {
                    ...dackTheme.token,
                    colorBgLayout: dackTheme.token.colorBgLayout,
                    fontFamily: typeface.values[typeface.values.length - 1]
                },
                components: dackTheme.components
            }}
            locale={zhCN}
        >
            <title>鲸阅言文</title>
            <>
                {contextHolder}
                <Oobe openMsg={openMsg} visible={!ifLibrary} />
                <DevMenu isdev={isdev} compactUi={compactUi} setcompactUi={setcompactUi} setcompact={setcompact} />
            </>
            <Layout style={{ minHeight: '100vh', }} className={styles.navs} hasSider={true}>
                <Sider className={styles.Header_region} key='a' trigger={null} collapsible style={{ backgroundColor: 'transparent' }} width={210} collapsedWidth={56} collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                    <SiderBody openMsg={openMsg} className={styles.Header_region_no} collapsed={collapsed} Menonclick={Menonclick} />
                </Sider>
                <Layout style={{ backgroundColor: 'transparent' }} >
                    <Header className={styles.Header_region} style={{ height: 46, padding: 0, }} >
                        <HeaderBody getSonMsg={{ TabMenu, collapsed }} />
                    </Header>
                    <Content className={styles.mains} style={{ backgroundColor: dackTheme?.token?.colorFillContent }}>
                       <MainBody
                            context={{
                                setTypeface: setTypeface,
                                openMsg: openMsg,
                                setTheme: setThemeColor,
                                userColor: themeColor,
                                setifoDack: tabThui,
                                ifoDack: ifoDack
                            }} /> 
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider >
    );
}
export default memo(App);
window.matchMedia('(prefers-color-scheme: dark)').addListener(err => {
    //@ts-ignore 程序主题更新事件
    window.autoUi(err.matches)
})

