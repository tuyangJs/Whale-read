import React, { useState } from 'react';
import { Row, Col, Segmented, Button, message } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { BranchesOutlined, BarsOutlined, FormOutlined, BookOutlined, InboxOutlined } from '@ant-design/icons'
import { APPinfo, AppBox } from "./AppBox"
import { Flexs } from '@/module/FlexsAnim'
const Apptab: APPinfo[] = [{
  name: '开发者支持',
  author: '芯阅言文',
  intro: '为开发者提供一套快速开发流程的工具',
  edition: '1.0.5',
  tag: ['开发工具', '套件'],
  logo: '',
  Appid: "a",
},
{
  name: '笔趣阁书源',
  author: '芯阅言文',
  intro: '为开发者提供一套快速开发流程的工具',
  edition: '1.0.5',
  tag: ['开发工具', '套件'],
  logo: '',
  Appid: "b",
},
{
  name: '笔迹',
  author: '芯阅言文',
  intro: '为开发者提供一套快速开发流程的工具',
  edition: '1.0.5',
  tag: ['开发工具', '套件'],
  logo: '',
  Appid: "c",
}
]
const App: React.FC = () => {
  const [value, setValue] = useState<string | number>(0)
  const [messageApi, contextHolder] = message.useMessage();
  //重封装消息提示函数
  function msgint(params: any) {
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
    <div className="example" style={{ width: '100%' }}>
      {contextHolder}
      <QueueAnim type='scale' delay={10} >
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
        <div key='b' style={{
          marginTop:12
        }}>
          <Flexs Flexpos={
            {
              vertical: false,
              wrap: 'wrap',
              gap: '16px 8px',
            }}
            IProps={{
              type: 'scale',
              delay: 160
            }}
          >
            {Apptab.map((info, i) => (
              <div key={`App_${i}`}>
                <AppBox {...info}/>
              </div>

            ))}
          </Flexs>

        </div>

      </QueueAnim>

    </div>
  )
}

export default App;