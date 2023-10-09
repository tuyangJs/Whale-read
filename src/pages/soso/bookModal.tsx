import React, { useState } from 'react';
import { Button, Modal } from 'antd';
interface ModalReturn {
  Modals: React.FC; // 一个函数组件，渲染Modal
  show: (data: object) => void; // 一个函数，打开或关闭Modal
}

// 定义一个函数，返回一个数组
const App = (): ModalReturn[] => {
  // 定义一个state，表示Modal的状态
  const [open, setOpen] = useState(false)
  // 定义一个函数，切换Modal的状态
  const [bookData, setBookData] = useState({})
  const show = (data: object) => {
    setBookData(data)
    setOpen(true)
  }

  const [loading, setLoading] = useState(false)

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  }
  const handleCancel = () => {
    setOpen(false);
  }
  // 定义一个函数组件，渲染Modal
  const Modals: React.FC = () => (
    <Modal
      open={open}
      style={{ backdropFilter: 'saturate(180%) blur(30px)', borderRadius:8,paddingBottom: '0px' }}
      title={bookData.name}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Return
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Submit
        </Button>,
        <Button
          key="link"
          href="https://google.com"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Search on Google
        </Button>,
      ]}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  )

  // 返回一个数组，包含三个元素
  return [{ Modals: Modals, show: show }]
};


export default App;