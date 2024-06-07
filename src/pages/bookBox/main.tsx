
import { UserOutlined, SendOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { Typography, Card, Divider, Space, Badge, Skeleton } from 'antd'
import { Image } from 'antd';
import imgerr from '@/assets/imgerr.svg'
import './main.less';
import { memo, useEffect, useRef, useState } from 'react';
const { Title, Text, Paragraph } = Typography;
const { Grid } = Card
class Bookvar {
  name!: string;
  label!: string[];
  author!: string;
  cover!: string;
  intr!: string;
  chapter!: string;
  id?: string;
  state?: number | null
}
const Presets = [
  { color: 'Presets', state: '连载' },
  { state: '完结', color: 'purple' },
  { state: '断更', color: 'yellow' }
]
function BookBoxM(props: { bookinfo: Bookvar, onShow: (id: string | undefined, callBack: (int: any) => void) => void, onclick?: (data: object) => void }) {
  const bookRef = useRef<HTMLDivElement>(null);
  const { onShow, bookinfo } = props
  const [bookint, setbookint] = useState(bookinfo);
  const { name, author, cover, label, chapter, state, id, intr: intrs } = bookint
  const [intr, setintr] = useState(intrs)
  useEffect(() => {
    const obs = new IntersectionObserver((enteues) => {
      for (const entry of enteues) {
        if (entry.isIntersecting) {
          onShow(id, int => {
            let bookints = bookint
            bookints.intr = int
            setbookint(bookints)
            setintr(int)
          })
        }
      }
    })
    if (bookRef.current) {
      obs.observe(bookRef.current)
    }
  }, [bookint, setbookint])
  const { onclick } = props
  const styles = {
    "backgroundImage": `url(${cover})`,
    'backgroundPosition': '50% 50%',
    'backgroundSize': 'cover',
  } as React.CSSProperties;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Badge.Ribbon
        color={(state == null) ? Presets[0].color : Presets[state].color}
        text={(state == null) ? Presets[0].state : Presets[state].state} placement={'end'}>
        <Card
          ref={bookRef}
          hoverable
          style={{ width: 416, borderRadius: 8, minHeight: 195, /* marginTop: 16,marginRight: 16  */ }}
          type='inner'
          bordered={false}
          onClick={() => {
            if (onclick) {
              onclick(bookint)
            }
          }}
        >
          <Grid style={{ padding: 8, boxShadow: 'none', width: 143 }}>
            <div style={{
              width: 127,
              margin: 0,
              borderRadius: 8,
              height: 179,
              ...styles
            }}

            />
          </Grid>
          <Grid style={{
            padding: '6px 8px',
            width: 263,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}

          >
            <>
              <Title level={5} style={{ margin: '2px 22px 2px 0' }} ellipsis={{ tooltip: true }} >{name}</Title>
              <Text style={{ marginTop: 4 }} ellipsis={{ tooltip: true }}>
                <UserOutlined style={{ marginRight: 4 }} />{author}  </Text>
              <Divider plain={true} orientation="left" dashed style={{ margin: '4px 0' }} >
                <AlignLeftOutlined style={{ marginRight: 10 }} />简介
              </Divider>
              <Paragraph type="secondary" style={{ margin: 0, textIndent: '1ch' }} ellipsis={{
                rows: 3
              }}>
                {intr ? intr.replace(/<br\s*\/?>|<\/?br>/gi, '') : <Skeleton active={true} title={false} paragraph={{ rows: 2 }} />}
              </Paragraph >
              <Divider dashed style={{ margin: '5px 0' }} />
              <Text ellipsis={true}>
                <SendOutlined style={{ marginRight: 5 }} />

                {(label.length > 0) ? label.map((Text, i) => {
                  return (
                    (i == 0) ? Text : '·' + Text
                  )
                }) : '暂无标签'
                }
              </Text>
            </>
          </Grid>
        </Card>
      </Badge.Ribbon>
    </Space>
  )
}
export default memo(BookBoxM)