import { useState } from 'react';
import { FloatButton, Drawer, Slider, InputNumber, Col, Row, ColorPicker, AutoComplete } from 'antd';
//阅读页面悬浮《页面设置按钮》与设置页面组件
const options = [
    { value: '微软雅黑' },
    { value: '宋体' },
    { value: '迷你简体' },
];
export default function PageSet() {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(11);
    const showDrawer = () => {
        setOpen(true);
    }

    const onClose = () => {
        setOpen(false);
    }
    const onChange = (newValue: number) => {
        setInputValue(newValue);
    };
    return (
        <div>
            <Drawer title="页面设置" placement="right" onClose={onClose} open={open} style={{background:'#fff'}}>
                <h3 > 字体</h3>
                <h4 > 大小</h4>
                <Row>
                    <Col span={12}>
                        <Slider
                            min={6}
                            max={26}
                            onChange={onChange}
                            value={typeof inputValue === 'number' ? inputValue : 0}
                        />
                    </Col>
                    <Col span={4}>
                        <InputNumber
                            min={6}
                            max={26}
                            style={{ margin: '0 16px' }}
                            value={inputValue}
                            onChange={onChange}
                        />
                    </Col>
                </Row>
                <h4 > 类型</h4>
                <AutoComplete
                    style={{ width: 200 }}
                    options={options}
                    placeholder="微软雅黑"
                    filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                />
                <h4>
              行间距
                </h4>
                <InputNumber min={1} max={10} defaultValue={1} onChange={onChange} />
                <h3>页面背景</h3>
                <ColorPicker showText
                    presets={[
                        {
                            label: '推荐背景',
                            colors: [
                                '#000000',
                                '#000000E0',
                                '#000000A6',
                                '#00000073',
                                '#00000040',
                                '#00000026',
                                '#0000001A',
                                '#00000012',
                                '#0000000A',
                                '#00000005',
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
                                '#F5222D4D',
                                '#FA8C164D',
                                '#FADB144D',
                                '#8BBB114D',
                                '#52C41A4D',
                                '#13A8A84D',
                                '#1677FF4D',
                                '#2F54EB4D',
                                '#722ED14D',
                                '#EB2F964D',
                            ],
                        },
                        {
                            label: '曾用背景',
                            colors: [],
                        },
                    ]}
                />
              
            </Drawer>
            <FloatButton tooltip={<div>页面设置</div>} onClick={showDrawer} />
        </div>

    )
}