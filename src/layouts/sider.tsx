import React, { useState } from 'react';
import QueueAnim from 'rc-queue-anim';
import Logoico from '../assets/logoico.svg'
import styles from './index.less';
import Texty from 'rc-texty';
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
interface Props {
    collapsed: Boolean,
    Menonclick: Function,
    className?:string
}
const App: React.FC<Props> = ({ collapsed, Menonclick,className}) => {
    const [location, setLocation] = useState(useLocation().pathname)
    history.listen(({ location: Letlocation, action }) => {
        setLocation(Letlocation.pathname)
    }
    )
    return (
        <QueueAnim className={className} style={{ marginTop: 12}} type='scaleX' delay={10}>
            <div className={styles.Header_region} key='a' style={{ alignItems: 'center', display: 'flex', gap: ' 8px', justifyContent: 'center' }}>
                <img src={Logoico} alt="" style={{ width: 32, height: 'aotu' }} />
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
                <Menu  style={{ borderInlineEnd: 0 }} selectedKeys={[location]}  mode='vertical' items={items} onSelect={Menonclick} />
            </div>
        </QueueAnim>
    )

}
export default App;