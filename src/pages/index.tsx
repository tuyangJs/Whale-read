import { Card, Dropdown,Space,Button,Typography} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import type { MenuProps } from 'antd';
import MeBookBox from './bookBox/Me'
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
  //message.info('Click on menu item.');
  console.log('click', e);
};
const menuProps = {
  items,
  onClick: handleMenuClick,
};
const { Title } = Typography;
export default function HomePage() {
  const Bookbody=[0,1,2,3,4,5,6,7,8,9,10]
  return (
    <div >
       <QueueAnim  className="queue-simple" type='scale' >       
      <div style={{display: 'flex'}} key="a">
      <div key="a">
      <Title level={5} style={{marginTop:0}}> 
        分组
      </Title>
      <Dropdown menu={menuProps}>
        <Button>
          <Space>
            全部
            <DownOutlined style={{marginLeft:30}} />
          </Space>
        </Button>
      </Dropdown>
      </div>
      <div style={{marginLeft:20}}>
      <Title level={5} style={{marginTop:0}}> 
        类型
      </Title>
      <Dropdown menu={menuProps}>
        <Button>
          <Space>
            全部
            <DownOutlined style={{marginLeft:30}}/>
          </Space>
        </Button>
      </Dropdown>
      </div>
      </div>
      </QueueAnim>
      <QueueAnim delay={300} className={styles.cradFox}  type='scale' style={{ display: 'flex',marginTop:20}} >
          {Bookbody.map((book,i) => {
            return(
              <div key={'book-'+i}>
              <MeBookBox />
            </div>
            )
          })
          }
      </QueueAnim>
   
    </div>
  );
}
