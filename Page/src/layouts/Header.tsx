import { Input, Dropdown, Space, Button, Row, Col, Typography } from 'antd';
import type { MenuProps } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';
import Hamburgico from '../pages/diydemo/Hamburg'

import { useState } from 'react';
const { Title } = Typography;

const { Search } = Input;
const onSearch = (value: string) => console.log(value)

export default function HeaderBody(props: any) {
    const { collapsed, TabMenu } = props.getSonMsg

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
    const items: MenuProps['items'] = itemsA
    const [sosoVua, sosomenu] = useState(itemsA[0].label);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        sosomenu(itemsA[Number(e.key) - 1].label)
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    const setCollapsed = TabMenu
    return (
        <div style={{ marginTop: 2 }}>
            <QueueAnim className="queue-simple" type='scaleY' delay={600}  >
                <Row key='a'>
                    <Col flex="1 1 60px" style={{ display: 'flex' }}>

                        <Button
                            type="text"
                            icon={<Hamburgico expand={collapsed} />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 36,
                                height: 36,
                                marginTop: 6
                            }}
                            className={styles.Header_region_no}
                        />
                        <Title level={5} style={{ margin: '12px 8px' }}>
                            {props.tite}
                        </Title>
                    </Col>
                    <Col flex="0 1 480px" >
                        <div style={{ marginTop: 8, marginRight: 10, display: 'flex' }} >
                            <Dropdown menu={menuProps} className={styles.Header_region_no}>
                                <Button>
                                    <Space>
                                        {sosoVua}
                                        <DownOutlined style={{ marginLeft: 10 }} />
                                    </Space>
                                </Button>
                            </Dropdown>

                            <Search className={styles.Header_region_no} placeholder="输入书名或者作者试试看~" onSearch={onSearch} style={{ marginLeft: 10, width: 200 }} />

                        </div>
                       
                    </Col>
                </Row>
            </QueueAnim>

        </div>
    )
}
