
import { UnorderedListOutlined, UserOutlined, AlignLeftOutlined, DownloadOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
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

function BookBoxM(props: { bookinfo: Bookvar, intbook: any, onclick?: (data: object) => void }) {
  const bookRef = useRef<HTMLDivElement>(null);
  const {intbook} = props
  const { name, author, cover, label, intr, chapter, state ,id} = props.bookinfo
  const [intrs, setintrs] = useState<string|null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver((enteues) => {
      for (const entry of enteues) {
        if(entry.isIntersecting){
          intbook(id,(iny:string)=>{
            setintrs(iny);
          })
        }
      }
    })
    if (bookRef.current) {
      obs.observe(bookRef.current)
    }
  }, [])
  const { onclick } = props
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Badge.Ribbon
        color={(state == null) ? Presets[0].color : Presets[state].color}
        text={(state == null) ? Presets[0].state : Presets[state].state} placement={'end'}>
        <Card
          ref={bookRef}
          hoverable
          style={{ width: 416, minHeight: 195, /* marginTop: 16,marginRight: 16  */ }}
          type='inner'
          bordered={false}
        >
          <Grid style={{ padding: 8, boxShadow: 'none', width: 143 }}>
            <Image style={{ margin: 0, borderRadius: 6, height: 'calc(100% - 16px)' }}
              alt={author}
              src={cover}
              placeholder
              fallback={imgerr}
              preview={{
                toolbarRender: (
                  _,
                  {
                    transform: { scale },
                    actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                  },
                ) => (
                  <Space size={12} className="toolbar-wrapper" >
                    <SwapOutlined rotate={90} onClick={onFlipY} />
                    <SwapOutlined onClick={onFlipX} />
                    <RotateLeftOutlined onClick={onRotateLeft} />
                    <RotateRightOutlined onClick={onRotateRight} />
                    <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                    <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                  </Space>
                ),
              }}
            />
          </Grid>
          <Grid style={{ padding: '6px 8px', width: 263, boxShadow: 'none' }}
            onClick={() => {
              if (onclick) {
                onclick(props.bookinfo)
              }
            }}
          >
            <>
              <Title level={5} style={{ margin: '2px 22px 2px 0' }} ellipsis={{ tooltip: true }} >{name}</Title>
              <Text style={{ marginTop: 4 }} ellipsis={{ tooltip: true }}><UserOutlined style={{ marginRight: 4 }} />{author + '  '}  |  {
                label.map((Text, i) => {
                  return (
                    (i == 0) ? Text : '·' + Text
                  )
                })
              }</Text>
              <Divider plain={true} orientation="left" dashed style={{ margin: '4px 0' }} >
                <AlignLeftOutlined style={{ marginRight: 10 }} />简介
              </Divider>
              <Paragraph type="secondary" style={{ margin: 0, textIndent: '1ch' }} ellipsis={{
                rows: 3
              }}>
                {intrs ? intrs : <Skeleton active={true} title={false} paragraph={{ rows: 2 }} />}
              </Paragraph >
              <Divider dashed style={{ margin: '5px 0' }} />
              <Text ellipsis={{ tooltip: true }}><UnorderedListOutlined style={{ marginRight: 5 }} />{chapter}</Text>
            </>
          </Grid>
        </Card>
      </Badge.Ribbon>
    </Space>
  )
}
export default  memo(BookBoxM)