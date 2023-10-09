import { Dropdown, Space, Button, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import type { MenuProps } from 'antd';
import MeBookBox from './bookBox/Me'
import React, { useEffect } from 'react';
const { Title } = Typography;

export default function HomePage() {
  document.title = '书架'
  let domit = 0
  const Bookbody = [
    {
      title: '我开局震惊了女帝',
      author: '隔江',
      readed: '25章', chapter: '125章', id: '1', state: 0,
      intr: '宁天来到天玄世界，睁眼竟然是女子的闺房？ 等等，这是什么情况？身为废物的他，绝美至极的女帝竟要在今晚和他成亲？！ 震惊！ 系统激活！ 震惊他人就能获得奖励！？ 开局震惊女帝，踏出人生大事第一步，完成举世震惊！ …… 宁天看向无数天骄圣子：“不是吧……我就随随便便修炼一下，都能让你们如此震惊？” 【简介无能，请移步正文！】',
      cover: ''
    },
    {
      title: '最终神职',
      author: '忆宛',
      readed: '35章', chapter: '225章', id: '1', state: 1,
      intr: '【最火签到爽文】 高考落榜，楚凌会所嫩模梦想被现实一套正蹬鞭腿左刺拳打的粉碎，只能去男子职业学院当和尚，本以为要打一辈子光棍，却没想到开启神豪签到系统 【在艺术教室签到，获得神级草书技能！】 【在宿舍签到，获得汤臣一品十套！】 【在财务处签到，获得呼吸有奖技能！呼吸便可得钱！】 ...... 四年时间，楚凌在校园不断签到。 四年之后，走出校园！ 这一次，让现实知道知道，什么叫做，年轻人从不讲武德！',
      cover: 'https://qidian.qpic.cn/qdbimg/349573/1037551502/300'
    },
    {
      title: '凡人修仙传',
      author: '记忆的海',
      readed: '45章', chapter: '325章', id: '1', state: 0,
      intr: '一个普通山村小子，偶然下进入到当地江湖小门派，成了一名记名弟子。他以这样身份，如何在门派中立足,如何以平庸的资质进入到修仙者的行列，从而笑傲三界之中！',
      cover: 'https://qidian.qpic.cn/qdbimg/349573/107580/300'
    }
    ,
    {
      title: '反派：迎娶植物人女主，疯狂贴贴',
      author: '请叫我太子殿下',
      cover: 'https://p9-reading-sign.fqnovelpic.com/novel-pic/p2o71b0057836070ec8bff9874b5780f56c~tplv-resize:225:0.image?x-expires=1692714219&x-signature=Og5P3hRdGKeNvohHuIKhhEKXmeQ%3D',
      intr: '林轩穿成都市小说中的暴躁反派。 开局被偏爱私生子的渣爹，逼着替嫁身患厌男症的植物人女配。 幸好【疯狂贴贴】系统到账。 只要和气运值高的人肢体接触，就能获得积分，购买各种商品技能。 于是林轩当机立断，选择成为女配苏清歌的冲喜对象。 新婚夜。 望着绝美的植物人女配，林轩开启了疯狂贴贴模式。 ... 我叫苏清歌，我被心生嫉妒的姑姑谋害为植物人。 在绝望之际，爷爷找来了林轩为我冲喜。 对方无微不至的“贴贴”照顾，令我羞耻的同',
      chapter: '第64章 林轩与苏清歌准备领结婚证啦！（4千字大章）',
      id: '0',
      state: 1,
    }
  ]
  const items: MenuProps['items'] = [
    {
      label: '默认分组',
      key: '1',
    },
    {
      label: '2nd menu item',
      key: '2',
    }
  ];
  const handleMenuClick: MenuProps['onClick'] = () => {
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const [bookGroup, setbookGroup] = React.useState(menuProps)
  Hive.getGroup((data: string[]) => {
    const sitem: MenuProps['items'] = [{ key: 'All', label: '全部' }]
    try {
      data.map((key: string, i: number) => {
        sitem.push({
          key: i,
          label: key
        })
      })

    } catch (error) {

    } finally {
      useEffect(() => {
        setbookGroup({
          items: sitem,
          onClick: handleMenuClick,
        })
      }, []
      )
    }
  })

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
            <Dropdown menu={bookGroup}>
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
            return (
              <div key={'book-' + i}>
                <MeBookBox bookSimpleinfo={book} >
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
