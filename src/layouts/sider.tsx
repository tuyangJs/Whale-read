import React, { memo, useState } from 'react';
import QueueAnim from 'rc-queue-anim';
import Upbook from './upbook';
import Logoico from '../assets/logo.png'
import { ReactComponent as Logotite } from '../assets/logoTite.svg'
import styles from './index.less';
import { Menu } from 'antd';
import { useLocation, history } from 'umi';
import { AppstoreAddOutlined, BuildOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';


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
    getItem('设置', '/setweb', <SettingOutlined />, null, null, styles.menu)

]
const sider: React.FC<Props> = ({ collapsed, Menonclick, className, openMsg }) => {
    const [location, setLocation] = useState(useLocation().pathname)
    history.listen(({ location: Letlocation }) => {
        
        setLocation(Letlocation.pathname)
    })
    return (
        <QueueAnim className={className} style={{ marginTop: 12 }} type='scaleX' delay={10}>
            <div className={styles.Header_region} key='a' style={{ alignItems: 'center', display: 'flex', gap: ' 8px', justifyContent: 'center' }} >
                <img src={Logoico} alt="" key="a" style={{ borderRadius: 8, border: '1px solid #bbbbbb4a', width: 36, height: 'aotu', backgroundSize: '100%' }} />

                {collapsed ? null : (
                    <QueueAnim type='scale' style={{ height: 18, filter: 'blur(8px)' }} delay={50}>
                        <a href="" key="a" >  <Logotite style={{ height: 18, stroke: 'currentColor' }} /></a>
                    </QueueAnim>
                )}
            </div>
            <div key='b' >
                 <Menu style={{ borderInlineEnd: 0 }} selectedKeys={[location]} mode='vertical' items={items} onSelect={Menonclick} /> 
            </div>
            <div className={styles.Header_region_no} style={{
                bottom: 0,
                margin: '6px 4px',
                position: 'absolute',
                minWidth: 'calc(100% - 8px)'
            }} key='c'>
                <Upbook dosShow={collapsed} openMsg={openMsg} />
            </div>
        </QueueAnim>
    )
}
export default memo(sider) ;