import { Button, Typography, ColorPicker, ConfigProvider, Form, Card, Row, Col, Dropdown, Space, Switch, message, Tag } from 'antd';
import React from 'react';
import { useOutletContext } from 'umi';
import type { Color } from 'antd/es/color-picker';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
const { Title, Text } = Typography;

import type { MenuProps } from 'antd';

type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
  colorlet: string[],
  theme: number,
}
const items: MenuProps['items'] = [
  {
    label: '浅色',
    key: 1,
  },
  {
    label: '深色',
    key: 2,
  },
  {
    label: '自动',
    key: 3,
  }
];

export default function set() {
  const layoutContext = useOutletContext();
  const [form] = Form.useForm();
  //颜色预设
  const colors = [{
    label: '推荐颜色',
    colors: [
      '#F5222D',
      '#FA8C16',
      '#FADB14',
      '#8BBB11',
      '#52C41A',
      '#13A8A8',
      '#1677FF',
      '#2F54EB',
      '#722ED1',
      '#EB2F96',
    ],
  }]

  const colo = Hive.filedata('colorlet')
  const colorlets = colo ? colo : ['#13A8A1']
  const defaultData: ThemeData = {
    borderRadius: 6,
    colorPrimary: layoutContext.userColor,
    colorlet: colo,
    theme: 0,
  };
  const [data, setData] = React.useState < ThemeData > (defaultData)
  const newcolor = (cdata: string[]) => { //保存曾用色
    cdata.map((key, i) => {
      if (i > 0 && key == cdata[0]) {
        cdata.splice(i, 1)
      }
    })

    if (cdata.length > 30) {
      for (let i = 0; i < (cdata.length - 30); i++) {
        cdata.pop()
      }
    }
    Hive.filedata('colorlet', cdata)
    setData({
      ...data,
      colorlet: cdata
    })
  }
  if (data?.colorlet?.length > 0) {
    colors.push({
      label: '曾用颜色',
      colors: data.colorlet
    })
  } else {
    colors.splice(1, 1)
  }
  // 主题设置
  const ifoDack = layoutContext.ifoDack
  let ifoDackT
  if (ifoDack == 1) {
    ifoDackT = '浅色'
  } if (ifoDack == 2) {
    ifoDackT = '深色'
  }
  if (ifoDack == 3) {
    ifoDackT = '自动'
  }
  const setifoDack = layoutContext.setifoDack
  const onClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    setifoDack(key)
    Hive.filedata('ifoDack', key)
  }
  //@ts-ignore 背景效果
  const backdrops = (Hive.filedata('backdrop') == undefined) ? true : Hive.filedata('backdrop')

  console.log(backdrops, Hive.filedata('backdrop'));

  const [backdrop, setBackdrop] = React.useState < boolean > (backdrops)
  const [messageApi, contextHolder] = message.useMessage()
  return (

    <div style={{ marginRight: 18 }}>
      <ConfigProvider
        theme={{ token: { colorPrimary: data.colorPrimary, borderRadius: data.borderRadius } }}
      >
        {contextHolder}
        <Form

          form={form}
          labelAlign='left'
          onValuesChange={(changedValues, allValues) => {
            const colorObj = changedValues?.colorPrimary
              ? { colorPrimary: (allValues?.colorPrimary as Color)?.toHexString() }
              : {};
            setData({
              ...data,
              ...allValues,
              ...colorObj,
            });
          }}
          name="theme"
          initialValues={defaultData}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <QueueAnim type='right' delay={100} style={{
            gap: 8,
            display: 'grid',
            alignItems: 'start'
          }}>
            <Title key='a' level={4}>
              个性化
            </Title>
            <Card key='b' style={{ padding: ' 8px 16px' }}>
              <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                <Row justify="space-around" align="middle">
                  <Col flex={'auto'}>
                    <Form.Item style={{ marginBottom: 0, width: 500 }}
                      valuePropName="color"
                      name="colorPrimary"
                      label="主题颜色"
                      extra="设置后可在本页面预览，鼠标放在可互动组件查看效果"
                    >
                      <ColorPicker disabledAlpha presets={colors} showText={true} />
                    </Form.Item>
                  </Col>
                  <Col flex={'0 1 aotu'}>
                    <Form.Item name="submit" style={{ marginBottom: 0 }} wrapperCol={{ offset: 4, span: 20 }}>
                      <Button type="primary"
                        onClick={() => {
                          if (data.colorPrimary == data.colorlet[0]) return
                          const newdata = data.colorlet
                          newdata.unshift(data.colorPrimary)
                          newcolor(newdata)
                          layoutContext.setTheme(data.colorPrimary)
                        }}
                      >应用</Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Card.Grid>
            </Card>
            <Card key='c' style={{ padding: ' 8px 16px' }}>
              <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                <Row justify="space-around" align="middle">
                  <Col flex={'auto'}>
                    <Text>
                      程序主题：
                    </Text>
                  </Col>
                  <Col flex={'0 1 aotu'}>

                    <Form.Item name="theme" style={{ marginBottom: 0 }} wrapperCol={{ offset: 4, span: 20 }} valuePropName="theme" >
                      <Dropdown menu={{ items, onClick }} >
                        <Button>
                          <Space>
                            {
                              ifoDackT
                            }
                            <DownOutlined style={{ marginLeft: 30 }} />
                          </Space>
                        </Button>
                      </Dropdown>
                    </Form.Item>
                  </Col>
                </Row>
              </Card.Grid>
            </Card>
            <Card key='d' style={{ padding: ' 8px 16px' }}>
              <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                <Row justify="space-around" align="middle">
                  <Col flex={'auto'}>
                    <Text>
                      背景效果：
                    </Text>
                    <br />
                    <Text type="secondary">
                      亚克力：采样窗口后的背景；云母：采样桌面壁纸，节省资源占用
                    </Text>
                  </Col>
                  <Col flex={'0 1 aotu'}>
                    <Tag bordered={false} color={backdrop ? 'cyan' : 'purple'}>
                      {backdrop ? '亚克力' : '云母'}
                    </Tag>
                  </Col>
                  <Col flex={'0 1 aotu'}>
                    <Form.Item name="theme" style={{ marginBottom: 0 }} wrapperCol={{ offset: 4, span: 20 }} valuePropName="theme" >
                      <Text>

                      </Text>
                      <Switch defaultChecked checked={backdrop} onChange={(err) => {
                        Hive.filedata('backdrop', err)
                        setBackdrop(err)
                        messageApi.open({
                          type: 'warning',
                          content: '请重启程序以更换背景效果。',
                          key: 'backdropSwitch'
                        })
                      }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card.Grid>
            </Card>
          </QueueAnim>
        </Form>

      </ConfigProvider>
    </div >
  );
};