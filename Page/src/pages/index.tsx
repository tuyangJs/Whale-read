import { Card, Dropdown, Space, Button, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import type { MenuProps } from 'antd';
import yay from '../assets/yay.jpg';

import MeBookBox from './bookBox/Me'
import { BookSimpleInfo } from './bookBox/Me'

const { Meta } = Card;
const items: MenuProps['items'] = [
  {
    label: '默认分组',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    danger: true,
    disabled: true,
  },
];
const handleMenuClick: MenuProps['onClick'] = (e) => {
};
const menuProps = {
  items,
  onClick: handleMenuClick,
};
const { Title } = Typography;
export default function HomePage() {
  const Bookbody = [
    {title: '测试书1',
  readed:'25章',chapter:'125章',id:'1',state:0,
  cover:yay},
  {title: '测试书2',
  readed:'35章',chapter:'225章',id:'1',state:0,
  cover:'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'},
  {title: '测试书3',
  readed:'45章',chapter:'325章',id:'1',state:0,
  cover:'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'},]
  return (
    <div style={{ minHeight: "100%" }}>
      <QueueAnim className="queue-simple" type='scale' delay={200} >
        <div style={{
          display: 'flex', 
          width: '100%',
          alignItems: 'center',
        }} key="a"
        >
          <div key="a">
            <Title level={5} style={{ marginTop: 0 }}>
              分组
            </Title>
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  全部
                  <DownOutlined style={{ marginLeft: 30 }} />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <div style={{ marginLeft: 20 }}>
            <Title level={5} style={{ marginTop: 0 }}>
              类型
            </Title>
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  全部
                  <DownOutlined style={{ marginLeft: 30 }} />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
      </QueueAnim>
      <div>
        <QueueAnim delay={400} className={styles.cradFox} type='scale' style={{ display: 'flex', marginTop: 20 }} >
          {Bookbody.map((book, i) => {
            console.log("20230903001",book)
            return (
              <div key={'book-' + i}>
                <MeBookBox bookSimpleinfo = {book} >
                  {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                </MeBookBox>
              </div>
            )
          })
          }
        </QueueAnim>
     
      </div>


    </div>

  );
}
