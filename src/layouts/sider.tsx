import React, { memo, useEffect, useState } from 'react';
import QueueAnim from 'rc-queue-anim';
import Upbook from './upbook';
import Logoico from '../assets/logo.png'
import { ReactComponent as Logotite } from '../assets/logoTite.svg'
import styles from './index.less';
import { Menu } from 'antd';
import { useLocation, history } from 'umi';
import { AppstoreAddOutlined, BugTwoTone, BuildOutlined, HeartTwoTone, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
const OpenDev = (Hive.filedata('DevOpenMv') === true) ? true : false//是否处于开发者模式
type MenuItem = Required<MenuProps>['items'][number];
function getItem(
    label?: React.ReactNode,
    key?: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null,
    type?: 'group' | undefined | null,
    className?: string,
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
interface Props {
    collapsed: Boolean,
    Menonclick: Function,
    className?: string
    openMsg: Function,
    Siders: any
}
const items: MenuItem[] = [
    getItem('📖 阅读', 'grp', null, [
        getItem('书架', '/', <AppstoreAddOutlined />, null, null, styles.menu),
        getItem('在线搜索', '/soso', <SearchOutlined />, null, null, styles.menu)
    ], 'group'),
    getItem('🗃️ 功能', 'grpb', null, [
        getItem('扩展', '/app', <BuildOutlined />, null, null, styles.menu)
    ], 'group'),
    { type: 'divider' },
    getItem('设置', '/setweb', <SettingOutlined />, null, null, styles.menu),
    OpenDev ? getItem('开发中心', '/devtools', <BugTwoTone />, null, null, styles.menu) : null,
    getItem('关于', '/about', <HeartTwoTone twoToneColor="#eb2f96" />, null, null, styles.menu)
]
const sider: React.FC<Props> = ({ collapsed, Menonclick, className, openMsg, Siders }) => {
    const [location, setLocation] = useState(useLocation().pathname)
    useEffect(() => {
        const unlisten = history.listen(({ location: Letlocation }) => {
            if (Letlocation.pathname) {
                setLocation(Letlocation.pathname);
            }
        });

        return () => {
            unlisten();
        };
    }, []);
    return (
        <QueueAnim className={className} style={{ marginTop: 12, paddingInline: 8 }} type='scaleX' delay={10}>

            <div className={styles.Header_region} key='a' style={{ alignItems: 'center', display: 'flex', gap: ' 8px', justifyContent: 'center' }} >
                <img src={Logoico} alt="" key="a" style={{ borderRadius: 8, border: '1px solid #bbbbbb4a', width: 26, height: 'aotu', backgroundSize: '100%' }} />

                {collapsed ? null : (
                    <QueueAnim type='scale' style={{ height: 18}} delay={50}>
                        <a href="" key="a" >  <Logotite style={{ height: 18, stroke: 'currentColor' }} /></a>
                    </QueueAnim>
                )}
            </div>

            {Siders ? (
                <div key="bT" style={{ marginTop: 8 }}>
                    {Siders}
                </div>
            ) : (
                <QueueAnim type='scale' delay={50}>
                    <div key='cT'>
                        <Menu
                            style={{ borderInlineEnd: 0 }}
                            selectedKeys={[location]}
                            mode="vertical"
                            items={items}
                            onSelect={Menonclick} />

                    </div>
                    <div className={styles.Header_region_no} style={{
                        bottom: 0,
                        margin: '6px 4px',
                        position: 'absolute',
                        minWidth: 'calc(100% - 8px)',
                        right: 0,
                    }} key='dT'>
                        <Upbook dosShow={collapsed} openMsg={openMsg} />
                    </div>
                </QueueAnim>
            )
            }


        </QueueAnim >
    )
}
export default memo(sider);