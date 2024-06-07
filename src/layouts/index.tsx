


import React, { memo, useEffect, useState } from 'react';
import { history, useRouteProps } from 'umi';
import { Layout, theme, ConfigProvider, message, Button } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import styles from './index.less';
import Oobe from './oobe';
import HeaderBody from './Header'
import MainBody from './body'
import SiderBody from './sider'
import DevMenu from './devMenu'
import './typeface.less'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const { Header, Content, Sider } = Layout;
if (typeof Hive === 'undefined') {
    alert('非法的访问！')

} else {

}
//@ts-ignore
document.querySelector("body").style.margin = '0'
//@ts-ignore
document.querySelector("body").style.overflow = 'hidden'
const fs = require('fs');
console.log(fs);


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
var Windows11 = false
var isdev = false
//@ts-ignore 初始化主程序函数
const getProce = () => {
    // @ts-ignore 取参数列表
    const Proce = Hive.Process.argv
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
function hexToRGB(hex: string): string {
    if(!hex) return ''
    // 去掉 # 号

    hex = hex.replace('#', '');

    // 将十六进制颜色值转换为RGB
    const [r, g, b] = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));

    // 返回RGB颜色值
    return `rgb(${r}, ${g}, ${b})`;
}

//加深或淡化颜色
function darkenColor(baseColor: string, darkeningAmount: number): string {
    // 解析基础颜色的RGB值
    const [r, g, b] = baseColor.match(/\d+/g)!.map(Number);

    // 计算颜色调整量
    const adjustment = darkeningAmount / 100;

    // 调整RGB通道值，降低亮度
    const adjustedR = Math.max(0, Math.round(r * (1 - adjustment)));
    const adjustedG = Math.max(0, Math.round(g * (1 - adjustment)));
    const adjustedB = Math.max(0, Math.round(b * (1 - adjustment)));

    // 生成加深后的颜色
    const darkenedColor = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;

    return darkenedColor;
}

const App: React.FC = () => {
    const Menuc = (Webwidth < 820 ? true : false)
    const [collapsed, setCollapsed] = useState<boolean>(Menuc);
    //@ts-ignore 获取缓存数据
    const themeColors = Hive.filedata('themeColor') //用户配色缓存
    const [HDras, setHDras] = useState('')//标题栏组件钩子
    const [Siders, setSiders] = useState('')//导航栏钩子
    const [layColor, setlayColor] = useState<string[] | null>()//窗口背景色钩子
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
    const SetLayColor = (data: string) => {
        if (!data) {
            setlayColor(null)
            return
        }
        data = hexToRGB(data)
        const colors = dataThemeui(ifoDack) ? [darkenColor(data, 66), darkenColor(data, 75)] : [`${data}`, darkenColor(data, 10)]
        setlayColor(colors)
        return dataThemeui(ifoDack) ? darkenColor(data, 30) : darkenColor(data, 78)
    }
  /*   const Colors = dataThemeui(ifoDack) ? [darkenColor(hexToRGB(themeColors), 86), '#141416'] : [`${themeColors}26`, '#EEEEEE'] //用户主题算法颜色 */

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
            //适配Win10
            if (!Windows11) {
                Thmev.token.colorBgLayout = '#fcfdff'
            }
        }
        Thmev.token.colorPrimary = themeColor
        //@ts-ignore 适配云母效果
        if (Hive.filedata('backdrop') === false && Windows11) {
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
    const typefaced =  //字体默认配置
        [
            "HarmonyOS_Sans",
            "Light"
        ]

    if (typefaces === undefined) {
        Hive.filedata('typeface', typefaced)
        typefaces = typefaced
    }
    const [MaxWidth, setMaxWidth] = useState((history.location.pathname) === '/read' ? 280 : 206) //侧边栏隐藏
    const [Minidwidth, setMinidwidth] = useState((history.location.pathname) === '/read' ? 0 : 64) //侧边栏隐藏
    const [SiderShow, setSiderShow] = useState((history.location.pathname) === '/read' ? false : true) //是否进入阅读页面
    useEffect(() => {
        history.listen(async (e) => { //路由更新事件
            if (e.location.pathname === '/read') { //进入阅读页面，铺平页面
                setTimeout(() => {
                    setSiderShow(false)
                    //etMaxWidth(0)
                    setMinidwidth(0)
                }, 300);
            } else {
                setSiderShow(true)
               // setMaxWidth(206)
                setMinidwidth(64)
            }
        })
    }, [])
    //@ts-ignore 书库目录自检
    const ifLibrary = Hive.directorySelfTest(Hive.filedata('BookFile'))
    const [typeface, setTypeface] = React.useState(typefaces)
    const [typefaceTheme, settypefaceTheme] = React.useState(`${typefaces[0]}${(typefaces.length > 1) ? '_' + typefaces[typefaces.length - 1] : ''}`)
    useEffect(() => {
        settypefaceTheme(`${typeface[0]}${(typeface.length > 1) ? '_' + typeface[typeface.length - 1] : ''}`)
    }, [typeface])
    //=======初始化完成===========》》

    return (
        <ConfigProvider
            theme={{
                algorithm: dackTheme.algorithm,
                token: {
                    ...dackTheme.token,
                    colorBgLayout: dackTheme.token.colorBgLayout,
                    fontFamily: typefaceTheme
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
            <Layout style={{
                background: (!layColor) ? '' : `radial-gradient(${layColor[0]}, ${layColor[1]})`,
                minHeight: '100vh',
            }}
                className={styles.navs}
                hasSider={true}>
                <Sider
                    className={styles.Header_region}
                    key='a'
                    trigger={null}
                    collapsible
                    style={{ backgroundColor: 'transparent', minHeight: '100%' }}
                    width={MaxWidth}
                    collapsedWidth={Minidwidth}
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)} >
                    <div className={styles.Header_region_no} style={{
                        right: -12, position: 'absolute', top: 62, zIndex: 10
                    }}>
                        <Button
                            shape="circle"
                            size='small'
                            onClick={() => { setCollapsed(!collapsed) }}
                            icon={collapsed ? <RightOutlined /> : <LeftOutlined />} />
                    </div>
                    <SiderBody
                        Siders={Siders}
                        openMsg={openMsg}
                        className={styles.Header_region_no}
                        collapsed={collapsed}
                        Menonclick={Menonclick} />
                </Sider>

                <Layout style={{ backgroundColor: 'transparent' }} >
                    <Header className={styles.Header_region} style={{ height: 46, padding: 0, }} >
                        <HeaderBody getSonMsg={{ TabMenu, collapsed }} >
                            {HDras ? HDras : null}
                        </HeaderBody>
                    </Header>
                    <Content className={styles.mains} style={{
                        backgroundColor: SiderShow ? dackTheme?.token?.colorFillContent : '',
                        borderStyle: SiderShow ? 'thin' : 'none'
                    }}>
                        <MainBody
                            context={{
                                setHDras: setHDras,
                                setSiders: setSiders,
                                setlayColor: SetLayColor,
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

