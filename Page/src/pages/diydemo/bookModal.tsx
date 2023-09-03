import React, { useState, ReactElement } from 'react';
import { Button, Modal } from 'antd';

const App = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)
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
  const bodym: React.FC = () => {
    return(
      <Modal
      open={open}
      title="Title"
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
  }

  return [
    (err:boolean)=>{setLoading(err)}, bodym('')
  ]


}


export default App;