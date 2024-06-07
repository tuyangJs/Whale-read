import React, { memo, useState } from 'react';
import { Image, Card, Drawer, Space, Typography, Row, Col, Button, Dropdown, Tag, Divider, Flex } from 'antd';
import imgerr from '@/assets/imgerr.svg'
import type { MenuProps } from 'antd';
import { SwapOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomOutOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Scrollbar } from 'smooth-scrollbar-react';
import type { DrawerStyles } from 'antd/es/drawer/DrawerPanel';
class Bookvar {
  name?: string;
  label?: string[];
  author?: string;
  cover?: string;
  intr?: any;
  chapter?: string;
  id?: string;
  state?: number
}
const tagcolor = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple'
]

function getRandomTags(count: number): string[] {
  let arr = tagcolor
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
const { Title, Text, Paragraph, Link } = Typography;
const Presets = [
  { color: 'green', state: '连载' },
  { state: '完结', color: 'cyan' },
  { state: '断更', color: 'orange' }
]
const Sbr = function HomePage(e: { style: React.CSSProperties | undefined; children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) {
  // @ts-ignore
  return (<Scrollbar
    style={e.style}
    plugins={{
      overscroll: {
        effect: "bounce",
        damping: 0.1,
        glowColor: 'rgb(22 22 22 / 75%)',
      } as const
    }}
    alwaysShowTracks={true}
  > {e.children}
  </Scrollbar>
  )
}


interface Props {
  bookData: Bookvar,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const details: React.FC<Props> = ({ bookData, open, setOpen }) => {
  // 定义一个函数，切换Modal的状态
  const onClose = () => {
    setOpen(false);
  }
  if (!bookData) return
  const { name, cover, author, state, intr, label } = bookData
  if (!name) return

  const tagclors = getRandomTags(label?.length ? label.length : 0)

  const array = intr.replace(/<br\/>/g, '\\n').split(/\\n|\\t|\\r/)


  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    }]
  return (
    <div>
      <Drawer
        styles={{
          borderRadius: '12px 0px 0px 12px',
          Header: { borderBottom: 'none' },
          body: { padding: 0, overflow: 'hidden' }
        } as DrawerStyles
        }
        contentWrapperStyle={{ top: 47, borderRadius: '12px 0px 0px 12px', backdropFilter: 'saturate(180%) blur(30px)' }}
        placement="right"
        onClose={onClose}
        closable={false}
        destroyOnClose={true}
        key='Drawer'
        open={open}>
        <Sbr key="Sbr" style={{
          height: ' calc(100vh - 56px)',
          overflow: 'hidden',
          padding: '8px 8px 0px 8px'

        }}
        >
          <Flex gap="middle" flex='initial' key='diba'>
            <Image style={{ margin: 0, width: 145, height: 'auto', borderRadius: 6 }}
              alt={name}
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
              <Flex 
              justify='space-around' 
              style={{flexDirection: 'column'}}
              >
                <Title style={{ margin: 0 }} level={4} >{name}</Title>
                <Link
                  strong={true}
                  style={{ margin: '4px 0px' }}
                >
                  {author}
                </Link>
                <Tag style={{ width: 'fit-content' }} bordered={false} color={Presets[state].color}>{Presets[state].state}</Tag>
                <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                  <Button style={{ marginTop: 12 }}>加入书架</Button>
                </Dropdown>
              </Flex>

          </Flex>
          <Divider key='Divider' orientation="left" plain>书籍简介</Divider>

          <Sbr style={{ maxHeight: 200, overflow: 'hidden', padding: 8 }}>
            {array?.map((texts: string, i: number) => {
              if (texts) {
                return (
                  <Paragraph key={`Paragraph_${i}`} style={{ textIndent: '2em' }}>
                    {texts.trim()}
                  </Paragraph >)
              }

            })}
          </Sbr>

          <div style={{ marginTop: 8 }}>
            {
              label?.map((data, i) => {
                return (
                  <Tag key={`Tag_${i}`} color={tagclors[i]}>{data}</Tag>
                )
              })
            }
          </div>

        </Sbr>
      </Drawer >

    </div>
  );
};



export default memo(details);