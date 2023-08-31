import React, { useState } from 'react';
import { Row, Col, Card, Segmented, Button, message } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { BranchesOutlined, BarsOutlined, FormOutlined, BookOutlined, InboxOutlined } from '@ant-design/icons'

const App: React.FC = () => {
  const [value, setValue] = useState<string | number>(0)
  const [messageApi, contextHolder] = message.useMessage();
  //重封装消息提示函数
  function msgint (params:any) {
    messageApi.open({
      ...params,
      style: { marginTop: '5vh', },
      content: params.content
    })
  }
  const addApp = function () {
    //配置选项
    const key = 'updatable';
    const options = {
      title: '为镜芯阅读添加扩展',
      buttonLabel: '添加',
      filters: [
        { name: '配置文件', extensions: ['json'] },
      ]
    }

    msgint({
      key,
      type: 'loading',
      content: '等待打开文件',
      duration: 0,
    })
    //@ts-ignore 打开系统对话框
    Hive.osdialog('showOpenDialog', options).then((result) => {
      messageApi.destroy()
      if (result.canceled) {
        msgint({
          key,
          type: 'info',
          content: '操作取消',
          duration: 4,
        })
      }
    })
  }

  return (
    <div className="example">
      {contextHolder}
      <QueueAnim type='scale' delay={200} >
        <div key='a'>
          <Row style={{ marginTop: 10 }}>
            <Col flex="1 1 280px">
              <Segmented
                style={{ /* backgroundColor: '#141414'  */ }}
                value={value}
                onChange={(e) => {
                  setValue(e)
                }}
                options={[
                  {
                    label: '所有',
                    value: 0,
                    icon: <BarsOutlined />,
                  },
                  {
                    label: '书源',
                    value: 1,
                    icon: <BranchesOutlined />,
                  },
                  {
                    label: '写作',
                    value: 2,
                    icon: <FormOutlined />,
                  },
                  {
                    label: '阅读',
                    value: 3,
                    icon: <BookOutlined />,
                  },
                ]}
              />
            </Col>
            <Col flex="0 1 aotu">
              <Button onClick={addApp}>
                <InboxOutlined />
                安装扩展
              </Button>
            </Col>
          </Row>


        </div>

        <div key='b'>
          <Row style={{ marginTop: 10 }}>
            <Col flex="360px">
              <Card hoverable={true} style={{ height: 120 }}>
                <Card.Grid hoverable={false} style={{ padding: 0, width: 120, boxShadow: 'none' }}>
                  <img
                    style={{ margin: 8, width: '-webkit-fill-available' }}
                    src="https://img1.baidu.com/it/u=1240466764,3606188766&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt="" />
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: 238, margin: ' 22px 0', padding: 0, boxShadow: 'none' }} >
                  <Card.Meta
                    title="笔趣阁书源"
                    description="This is the description"
                  />
                </Card.Grid>
              </Card>
            </Col>
            <Col flex="auto">Fill Rest</Col>
          </Row>
        </div>

      </QueueAnim>

    </div>
  )
}

export default App;