import React, { useState } from 'react';
import { history } from 'umi';
import {
    ExpandOutlined,
    ReloadOutlined,
    CompressOutlined,
    ToolOutlined,
    BugOutlined,
    AntDesignOutlined,
    GithubOutlined
} from '@ant-design/icons';
import { FloatButton, Layout, theme, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import styles from './index.less';
import HeaderBody from './Header'
import MainBody from './body'
import SiderBody from './sider'
const { Header, Content, Sider } = Layout;

//@ts-ignore
document.querySelector("body").style.margin = '0'
//@ts-ignore
document.querySelector("body").style.overflow = 'hidden'
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
            colorBgHeader: 'transparent'
        }
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
    }
}




type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
};
const defaultData: ThemeData = {
    borderRadius: 6,
    colorPrimary: '#00b96b',
};

var Windows11 = false
var isdev = false
const getProce = () => {
    // @ts-ignore 取参数列表
    const Proce = Hive.Process
    Proce.map((data: string) => {
        /* 判断win10还是win11 */
        if ('os=Win11' === data) {
            Windows11 = true
        }
        //是开发运行环境
        if ('isdev' === data) {
            isdev = true
        }
    })

}
getProce()
var Webwidth = window.innerWidth;
let handleResizetm: any = null
const App: React.FC = () => {

    const Menuc = (Webwidth < 820 ? true : false)
    const [collapsed, setCollapsed] = useState<Boolean>(Menuc);
    //动态站点标题 
    const [Webtitle, setWebtitle] = useState(localStorage.getItem('Webtitle') ? localStorage.getItem('Webtitle') : '书架');

    //===================动态站点标题 EDM==================//>>
    //@ts-ignore 获取缓存数据
    const themeColors = Hive.filedata('themeColor') //用户配色缓存
    const [themeColor, setThemeColors] = useState(themeColors ? themeColors : '#1677FF')//用户主题预设
    //紧凑界面算法
    const [compactUi, setcompactUi] = useState(false)
    //@ts-ignore 切换主题算法
    let inmt: any = Hive.filedata('ifoDack')
    const intDack = parseInt(inmt ? inmt : 3)
    const [ifoDack, setifoDack] = useState(intDack) //是否为深色    
    //判断主题样式
    const dataThemeui = (err: number) => {
        let cui = err
        if (err == 3) {
            cui = window.matchMedia("(prefers-color-scheme: dark)").matches ? 2 : 1
        }
        return (cui == 2) ? true : false
    }
    // @ts-ignore  自动切换主题界面
    window.autoUi = function (err: any) {
        setTheme(setThemeui(err))
    }

    const isWindows11 = Windows11
    console.log('是否为Win11', isWindows11);

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
        }
        /* 这里判断win几变量 */
        Thmev.token.colorPrimary = themeColor
        //@ts-ignore 适配云母效果
        if (Hive.filedata('backdrop') == false) {
            Thmev.token.colorBgLayout = 'transparent'
        }
        return Thmev
    }
    const [dackTheme, setTheme] = useState<any>(setThemeui(dataThemeui(ifoDack)))
    Hive.winTheme(ifoDack, Hive.filedata('backdrop'))
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
        //@ts-ignore
        Hive.winTheme(err)
        setifoDack(err)
        setTimeout(() => {
            setTheme(setThemeui(dataThemeui(err)))
        }, 50);

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
        //e.domEvent.target.style.setProperty ('--active','""')
        localStorage.setItem('Webtitle', e.domEvent.target.innerText)
        setWebtitle(e.domEvent.target.innerText)
        history.push(e.key)
    }
    //切换导航栏状态
    const TabMenu = () => {
        setCollapsed(!collapsed)
    }

    //=======初始化完成===========》》
    return (
        <ConfigProvider
            theme={{
                algorithm: dackTheme.algorithm,
                token: dackTheme.token,
                components: dackTheme.components
            }}
            locale={zhCN}
        >
            <title>{Webtitle} - 镜芯阅读</title>

            <>

                <FloatButton.Group
                    trigger="click"
                    style={{ right: 24 }}
                    icon={<ToolOutlined />}
                    tooltip={<div>快速设置</div>}
                >
                    {isdev ? [
                        <FloatButton
                            icon={<BugOutlined />}
                            tooltip={<div>Open DevTools</div>}
                            onClick={() => Hive.opendevtools()}
                            type='primary'
                        />,
                        <FloatButton
                            icon={<AntDesignOutlined />}
                            tooltip={<div>Ant-Design文档</div>}
                            onClick={() => open('https://ant-design.gitee.io/components/overview-cn/')}
                            type='primary'
                        />,
                        <FloatButton
                            icon={<GithubOutlined />}
                            tooltip={<div>Github主页</div>}
                            onClick={() => open('https://github.com/iyuli/MirrorCore_read')}
                        />
                    ] : null}
                    <FloatButton
                        tooltip={<div>{!compactUi ? '紧凑界面' : '正常界面'}</div>}
                        icon={!compactUi ? <CompressOutlined /> : <ExpandOutlined />}
                        type={!compactUi ? 'default' : 'primary'}
                        onClick={() => {
                            setcompactUi(!compactUi)
                            const comui = !compactUi ? theme.compactAlgorithm : null
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
                        }
                    />
                    <FloatButton
                        icon={<ReloadOutlined />}
                        tooltip={<div>重新渲染界面</div>}
                        onClick={() => window.location.reload()}
                    />
                </FloatButton.Group>
            </>
            <Layout style={{ minHeight: '100vh', }} className={styles.navs} hasSider={true}>
                {/*  左侧栏 */}
                <Sider className={styles.Header_region} key='a' trigger={null} collapsible style={{ backgroundColor: 'transparent' }} width={210} collapsedWidth={56} collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                    <SiderBody className={styles.Header_region_no} collapsed={collapsed} Menonclick={Menonclick} />
                </Sider>

                <Layout style={{ backgroundColor: 'transparent' }} >

                    <Header className={styles.Header_region} style={{ height: 46, padding: 0, }} >

                        <HeaderBody tite={Webtitle} getSonMsg={{ TabMenu, collapsed }} />
                    </Header>
                    <Content className={styles.mains} style={{ backgroundColor: dackTheme?.token?.colorFillContent }}>
                        <MainBody context={{ setTheme: setThemeColor, userColor: themeColor, setifoDack: tabThui, ifoDack: ifoDack }} />
                    </Content>

                </Layout>
            </Layout>
        </ConfigProvider >
    );
}
export default App;

setTimeout(() => {
    try {
        //@ts-ignore 程序主题更新事件
        Hive.onchange(window.autoUi)
    } catch (error) {

    }

}, 1000);



