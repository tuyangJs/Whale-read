
import { UnorderedListOutlined, UserOutlined, AlignLeftOutlined, DownloadOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Typography, Card, Divider, Space, Badge } from 'antd'
import { Image } from 'antd';
import imgerr from '@/assets/imgerr.svg'
import './main.less';
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
export default function BookBoxM(props: { bookinfo: Bookvar ,onclick?:Function}) {
  const { name, author, cover, label, intr, chapter, state } = props.bookinfo
  const onDownload = () => {
    try {
      fetch(cover)
        .then((response) => response.blob())
        .then((blob) => {
          const imgBlob = new Blob([blob])
          const url = URL.createObjectURL(imgBlob);
          const imgtype = imgBlob.type.replace('image/', '.')
          const link = document.createElement('a');
          link.href = url;
          link.download = name + '-' + author + ((imgtype == '') ? '.jpg' : imgtype)
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(url);
          link.remove();
        });
    } catch (error) {

    }

  };
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Badge.Ribbon
        color={(state == null) ? Presets[0].color : Presets[state].color}
        text={(state == null) ? Presets[0].state : Presets[state].state} placement={'end'}>
        <Card
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
                    <DownloadOutlined onClick={onDownload} />
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
            onClick={function(){
              if(onclick){
                onclick( props.bookinfo )
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
              <Paragraph type="secondary" style={{ margin: 0,  textIndent: '1ch'}} ellipsis={{
                rows: 3
              }}>
                { intr}
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