import React, { CSSProperties, useCallback, useState } from 'react';
import { useLocation, history } from 'umi';
import {
    AppstoreAddOutlined,
    SettingOutlined,
    BuildOutlined,
    ExpandOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { FloatButton, Layout, Menu, theme, ConfigProvider } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import HeaderBody from './Header'
import Logoico from '../assets/logoico.svg'
import Texty from 'rc-texty';
import MainBody from './body'
import { CompressOutlined, ToolOutlined, SearchOutlined } from '@ant-design/icons';
const { Header, Content, Sider } = Layout;

//@ts-ignore
document.querySelector("body").style.margin = '0'
//@ts-ignore
document.querySelector("body").style.overflow = 'hidden'
type MenuItem = Required<MenuProps>['items'][number];

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
//夜间配色普通
const ledackTheme = {
    token: {
        colorPrimary: '#d89614',
        colorBgLayout: '#0c0c0c',
        colorFillContent: '#373737',
        colorBgContainer: '#141414',
        // colorBgElevated:'#141414f2',
        itemActiveBg: '#303030',
        itemSelectedBg: '#303030',
        itemHoverBg: '#303030',
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

function getItem(
    label?: React.ReactNode,
    key?: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]| null,
    type?: 'group' | undefined | null,
    className?:string,
    
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
        className,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('📖 阅读', 'grp', null, [
        getItem('书架', '/', <AppstoreAddOutlined />,null,null,styles.menu),
        getItem('在线搜索', '/soso', <SearchOutlined />,null,null,styles.menu)
    ], 'group'),
    getItem('🗃️ 功能', 'grpb', null, [
        getItem('扩展', '/app', <BuildOutlined />,null,null,styles.menu)
    ], 'group'),
    { type: 'divider' },
    getItem('设置', '/setweb', <SettingOutlined />,null,null,styles.menu)

]


type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
};
const defaultData: ThemeData = {
    borderRadius: 6,
    colorPrimary: '#00b96b',
};
//console.log(theme);

var Webwidth = window.innerWidth;
let handleResizetm: any= null
const App: React.FC = () => {
   
    const [location, setLocation] = useState(useLocation().pathname);
    const Menuc = (Webwidth < 820 ? true : false)
    const [collapsed, setCollapsed] = useState<Boolean>(Menuc);
    //动态站点标题 
    const [Webtitle, setWebtitle] = useState(localStorage.getItem('Webtitle') ? localStorage.getItem('Webtitle') : '书架');
    history.listen(({ location: Letlocation, action }) => {
        setLocation(Letlocation.pathname)
    }
    )
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
    const Menonclick = (e: any) => {
        localStorage.setItem('Webtitle', e.domEvent.target.innerText)
        setWebtitle(e.domEvent.target.innerText)
        history.push(e.key)
    }
    //切换导航栏状态
    const TabMenu = () => {
        setCollapsed(!collapsed)
    }



    var Animate = require('rc-animate');
    //=======初始化完成===========》》
    return (
        <ConfigProvider
            theme={{
                algorithm: dackTheme.algorithm,
                token: dackTheme.token,
                components: dackTheme.components
            }}
        >
            <title>{Webtitle} - 镜芯阅读</title>

            <>

                <FloatButton.Group
                    trigger="click"
                    style={{ right: 24 }}
                    icon={<ToolOutlined />}
                    tooltip={<div>快速设置</div>}
                >
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
            <Layout style={{ minHeight: '100vh', }} className={styles.navs} hasSider ={true}>
                {/*  左侧栏 */}
                <Sider key='a' trigger={null} collapsible style={{ backgroundColor: 'transparent' }} width={210} collapsedWidth={56} collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                    <QueueAnim type='scaleBig' delay={10}>
                        <div key='a' className={styles.Logovertical} style={{ alignItems: 'center', display: 'flex', gap: ' 8px', justifyContent: 'center' }}>
                            <img src={Logoico} alt="" style={{ width: 32, height: 'aotu', color: dackTheme.token.colorPrimary }} />
                            {collapsed ? null : (
                                <Texty
                                    type={'right'}
                                    mode={'smooth'}
                                    delay={500}
                                    className={styles.LogoText} >镜芯阅读 </Texty>
                            )
                            }
                        </div>
                        <div key='b' >
                            <Menu style={{ borderInlineEnd: 0 }} selectedKeys={[location]} defaultSelectedKeys={0} mode='vertical' items={items} onSelect={Menonclick} />
                        </div>
                    </QueueAnim>
                </Sider>
               
                <Layout style={{ backgroundColor: 'transparent' }} >

                    <Header className={styles.Header_region} style={{ height: 46, padding: 0, }} >

                        <HeaderBody tite={Webtitle} getSonMsg={{ TabMenu, collapsed }} />
                    </Header>
                    <Content className={styles.mains} style={{ backgroundColor: dackTheme?.token?.colorFillContent }}>

                                <MainBody context={{ setTheme: setThemeColor, userColor: themeColor, setifoDack: tabThui, ifoDack: ifoDack }}  />
                       

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



