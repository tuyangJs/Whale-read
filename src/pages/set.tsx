import { Button, ColorPicker, ConfigProvider, Form } from 'antd';
import type { Color } from 'antd/es/color-picker';
import React from 'react';

type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
};

const defaultData: ThemeData = {
  borderRadius: 6,
  colorPrimary: '#1677ff',
};

export default () => {
  const [form] = Form.useForm();

  const [data, setData] = React.useState<ThemeData>(defaultData);

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: data.colorPrimary, borderRadius: data.borderRadius } }}
    >
      <Form
        form={form}
        onValuesChange={(changedValues, allValues) => {
          const colorObj = changedValues?.colorPrimary
            ? { colorPrimary: (allValues?.colorPrimary as Color)?.toHexString() }
            : {};
          setData({
            ...allValues,
            ...colorObj,
          });
        }}
        name="theme"
        initialValues={defaultData}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item valuePropName="color" name="colorPrimary" label="主题色">
          <ColorPicker />
        </Form.Item>
        <Form.Item name="submit" wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};