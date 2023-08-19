import React, { useState} from 'react';
import { Outlet, useLocation, history } from 'umi';
import {
    DesktopOutlined,
    FileOutlined,
    AppstoreAddOutlined,
    TeamOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { FloatButton, Switch, Layout, Menu, theme, ConfigProvider } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import HeaderBody from './Header'
import Texty from 'rc-texty';
import { CompressOutlined, ToolOutlined, SearchOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

document.querySelector("body").style.margin = '0'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}
//菜单定义
const Menubody = [
    { name: '书架', pat: '/', ico: <AppstoreAddOutlined /> },
    { name: '在线搜索', pat: '/soso', ico: <SearchOutlined /> },
    { name: '设置', pat: '/set', ico: <SettingOutlined /> },
]
 const items: MenuItem[] = [] 
 items.splice(0,0)
 Menubody.map((key) => {
    const Mtems = getItem(key.name, key.pat, key.ico)
    items.push(Mtems)
}) 
/* const items: MenuItem[] = [
    getItem('书架', '/', <AppstoreAddOutlined />),
    getItem('在线搜索', '/soso', <SearchOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3',),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
    getItem('设置', '/set', <SettingOutlined />),
];  */
type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
};
const defaultData: ThemeData = {
    borderRadius: 6,
    colorPrimary: '#00b96b',
};
//console.log(theme);
//夜间配色
const dackTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: '#00b96b',
        colorBgLayout: '#141414',
        colorFillContent: '#1e1e1e',
    },
    components: {
        Menu: {
            colorBgContainer: '#141414'
        }
    }
}
var Webwidth = window.innerWidth;


const App: React.FC = () => {
    const [location, setLocation] = useState(useLocation().pathname);
    history.listen(({location:Letlocation, action }) => 
    setLocation(Letlocation.pathname)
    )
    const Menuc = (Webwidth < 800 ? true : false)
    const [collapsed, setCollapsed] = useState(Menuc);
    const colorBgContainer = '#141414'
    //动态站点标题 
    const [Webtitle, setWebtitle] = useState('镜芯阅读');
    Menubody.map((Tkey) => {
       let Name = Tkey.name +' - 镜芯阅读'
        if (Tkey?.pat == location && Name != Webtitle) {
            setWebtitle(Name)
        }
    })
    if (location == '/read') {
        return (
            <><title>{Webtitle}</title><Outlet /></>
        )
    }

    //===================动态站点标题 EDM==================//>>
    const handleResize = (e: any) => {
        //自适应导航栏
        if (e.target.innerWidth < 800) {
            if (Webwidth > e.target.innerWidth) {
                Webwidth = e.target.innerWidth
                setCollapsed(true)
            }
        }
        else {
            if (e.target.innerWidth > 800) {
                if (Webwidth < e.target.innerWidth) {
                    Webwidth = e.target.innerWidth
                    setCollapsed(false)
                }
            }
        }

    }
    window.addEventListener('resize', handleResize) //监听窗口大小改变

    const Menonclick = (e: any) => {
        webTab()
        history.push(e.key)
    }
    //切换导航栏状态
    const TabMenu = () => {
        setCollapsed(!collapsed)
    }
    const [open, setOpen] = useState(true);
    const onChange = (checked: boolean) => {
        setOpen(checked);
    };
    var state = {
        show: true
    };


    const webTab = () => {
        state.show = !state.show
    }
    //搜索框设置
    const itemsA = [
        {
            label: '本地搜索',
            key: 1,
        },
        {
            label: '在线搜索',
            key: 2,
        }
    ]
    const [sosoVua, sosomenu] = useState(itemsA[0].label);
    return (
        <ConfigProvider
            theme={dackTheme}
        >
            <title>{Webtitle}</title>
            <>
                <FloatButton.Group
                    trigger="click"
                    style={{ right: 24 }}
                    icon={<ToolOutlined />}
                >
                    <FloatButton />
                    <FloatButton icon={<CompressOutlined />} />
                </FloatButton.Group>
            </>
            <Layout style={{ minHeight: '100vh', background: colorBgContainer }} className={styles.navs}>

                <Sider trigger={null} collapsible style={{ backgroundColor: dackTheme.token.colorBgLayout }} collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                    <QueueAnim delay={100} className="queue-simple" type={'scaleX'}>

                        <div className={styles.Logovertical}>
                            <Texty
                                type={'left'}
                                delay={200}
                                className={styles.LogoText} >镜芯阅读 </Texty>

                        </div>
                        <div key='a' >
                            <Menu style={{ borderInlineEnd: 0 }}  selectedKeys={[location]}  defaultSelectedKeys={[location]} mode="inline" items={items} onClick={Menonclick} />
                        </div>
                    </QueueAnim>
                </Sider>

                <Layout >
                    <Header style={{ padding: 0, backgroundColor: dackTheme.token.colorBgLayout }} >

                        <HeaderBody tite={Webtitle}items={itemsA} sosoVua={sosoVua} onMenuck={sosomenu} getSonMsg={{ TabMenu, collapsed }} />
                    </Header>
                    <Content style={{ margin: '0 0 0 0', borderRadius: '12px 0 0 0', backgroundColor: dackTheme.token.colorFillContent }}>
                        <div style={{ padding: '15px 24px 0 24px', minHeight: 360 }}>
                            <QueueAnim delay={300} className="queue-simple" type='alpha' forcedReplay={true}>
                                {state.show ? [
                                    <Outlet key='a' />
                                ] : null}

                            </QueueAnim>
                        </div>
                    </Content>

                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default App;