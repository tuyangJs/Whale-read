import { Input, Dropdown, Space, Button, Row, Col ,Typography} from 'antd';
import type { MenuProps } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { DownOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
const { Title } = Typography;

const { Search } = Input;
const onSearch = (value: string) => console.log(value)


export default function HeaderBody(props: any) {
    const { collapsed, TabMenu } = props.getSonMsg
    const items: MenuProps['items'] = props.items
    const sosomenu = props.onMenuck
    const itemsA = props.items
    const sosoVua = props.sosoVua
    
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        sosomenu(itemsA[Number(e.key)-1].label)
      };
    
    const menuProps = {
        items,
        onClick: handleMenuClick,
      };
    const setCollapsed = TabMenu
    return (
        <div style={{ marginTop:2}}>
            <QueueAnim className="queue-simple" type='top'  >
                <Row key='a'>

                    <Col flex="1 1 60px" style={{display: 'flex'}}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: '54px',
                                height: 'auto',
                                marginTop:2
                            }}

                        />
                        <Title level={5} style={{ margin: '16px 8px' }}>
                            {props.tite.replace(' - 镜芯阅读','')}
                        </Title>
                        </Col>
                    <Col flex="0 1 500px">
                        <div style={{ marginTop: "12px", marginRight: 12,display: 'flex'}}>
                            <Dropdown menu={menuProps} >
                                <Button>
                                    <Space>
                                        {sosoVua}
                                        <DownOutlined style={{ marginLeft: 10}} />
                                    </Space>
                                </Button>
                            </Dropdown>
                            <Search placeholder="输入书名或者作者试试看~" onSearch={onSearch} style={{marginLeft:10,width: 300 }} />
                        </div>
                    </Col>

                </Row>
            </QueueAnim>

        </div>
    )
}
