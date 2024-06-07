import { Dropdown, Space, Button, Typography, Flex, notification } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import type { MenuProps } from 'antd';
import MeBookBox from './bookBox/Me'
import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import Error from '@/assets/ErrorBook.json'
const { Title } = Typography;

const LodingBook = (callBack: (arg0: any) => void) => {

  Hive.LoadingBooks(() => {
    setTimeout(() => {
      callBack(Hive.GetbookEpub())
    }, 0)
  })

}
type Book = {
  title: string;
  author: string;
  readed: number;
  chapter: number;
  date: string;
  state: number;
  intr: string;
  cover: string;
  grouping: string
  id: string
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
let AllBookQueue: Book[] = []

export default function HomePage() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (config: { type: NotificationType, message: string, description?: string }) => {
    const { type, message, description } = config
    api[type]({
      message: message,
      description: description,
      placement: 'bottomRight',
    });
  };
  document.title = '书架'
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
  const handleMenuClick: MenuProps['onClick'] = async (err) => {
    await err
    const grouping = err.domEvent.target.innerText
    if (grouping === '全部') {
      setBookQueue(AllBookQueue)
      return
    }
    try {
      setdropdown(grouping)
      const Newdata = AllBookQueue.filter((book) => book.grouping === grouping);
      setBookQueue(Newdata)
    } catch (error) {
      console.error(error);

    }

  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const [bookGroup, setbookGroup] = React.useState(menuProps)
  const [BookQueue, setBookQueue] = React.useState<Book[] | boolean>(false)
  const [dropdown, setdropdown] = React.useState('全部')
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
      console.error(error);

    } finally {
      useEffect(() => {
        //载入书籍
        LodingBook((epub: any) => {
          const Bookbody: Book[] = []
          Object.keys(epub).forEach((epubs: any) => {
            const keys = Object.keys(epub[epubs])
            keys?.forEach(data => {
              if (typeof epub[epubs][data] === 'string') {
                openNotification({
                  type: 'error',
                  message: '书籍加载失败！',
                  description: epub[epubs][data]
                })
              } else {

                const { title, creatorFileAs, cover, date, description, UUID } = epub[epubs][data].metadata
                let covers
                try {
                  covers = epub[epubs][data].manifest[cover]['media-type'].replace('image/', `${cover}.`)

                } catch (error) {

                } finally {
                  Bookbody.push({
                    title: title,
                    author: creatorFileAs,
                    readed: 25,
                    chapter: epub[epubs][data].flow.length,
                    date: date,
                    state: 0,
                    id: UUID,
                    intr: description,
                    cover: covers,
                    grouping: epubs,
                    Bookfile: epub[epubs][data].filename
                  } as Book)
                }

              }
            })
          })
          AllBookQueue = Bookbody
          setBookQueue(Bookbody)
        })

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
      {contextHolder}
      <QueueAnim className="queue-simple" type='left' delay={0} >
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
                  {dropdown}
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
      <div style={{ marginTop: 12 }}>
        {(BookQueue.length > 0) ? (
          <Flex vertical={false} wrap='wrap' gap='8px 16px' >
            <QueueAnim delay={0} className={styles.cradFox} type='scale' >
              {BookQueue?.map((book, i) => {
                return (
                  <div key={'book-' + i}>
                    <MeBookBox bookSimpleinfo={book} />
                  </div>
                )
              })
              }
            </QueueAnim>
          </Flex>
        ) : (BookQueue ?
          <QueueAnim delay={0} type='scale' >
            <div
              key='a'

              style={
                {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  flexDirection: 'column',
                  height: 'inherit',
                }
              }>
              <Lottie style={{ width: 360 }} animationData={Error} loop={2} />
              <Title level={5}>这里空空如也...</Title>
            </div>
          </QueueAnim> : null
        )
        }

      </div>
    </div>

  );
}
