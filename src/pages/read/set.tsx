import { useEffect, useState } from 'react';
import { Slider, InputNumber, Col, Row, ColorPicker, AutoComplete, Typography, Select, Radio, Switch } from 'antd';
import typeface from '@/pages/setweb/typeface'
import { DefaultOptionType } from 'antd/es/select';
const { Title, Text } = Typography;
const { Option } = Select;
//阅读页面悬浮《页面设置按钮》与设置页面组件
type cgType = {
    fontWeight?: string;
    Typevalue?: any,
    fontSize?: number,
    lineSpace?: number,
    lineSpaceUnit?: string,
    readColor?: number,
    texture?: boolean
}
type prop = {
    onChange: (data: any) => void
    config: cgType
}
interface AfteProps {
    onChange?: ((value: string, option: DefaultOptionType | DefaultOptionType[]) => void)
    defaultValue?: string | null | undefined
}
const SelectAfter: React.FC<AfteProps> = ({ onChange, defaultValue }) => (
    <Select onChange={onChange} defaultValue={defaultValue} style={{ width: 'aotu' }}>
        <Option value="">默认</Option>
        <Option value="em">字体高度</Option>
        <Option value="px">像素</Option>
    </Select>
);
const readColorL = [
    { value: 0, Color: '#ebebeb' },
    { value: 1, Color: '#ebe6da' },
    { value: 2, Color: '#c9e0cb' },
    { value: 3, Color: '#f6efef' },
    { value: 4, Color: '#cedde1' },
    { value: 5, Color: '#e3d0a1' },
]
export default function PageSet(props: prop) {
    const { onChange, config } = props
    console.log(config);
    const { Typeface, Typevalue, TypefaceName } = typeface({ typefaces: config.Typevalue })
    const [fontSize, setfontSize] = useState(config.fontSize);
    const [lineSpace, setlineSpace] = useState(config.lineSpace);
    const [fontWeight, setfontWeight] = useState(config.fontWeight);
    const [readColor, setreadColor] = useState(config.readColor);
    const [texture, settexture] = useState(config.texture);
    const [lineSpaceUnit, setlineSpaceUnit] = useState(config.lineSpaceUnit ? config.lineSpaceUnit : '');
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({ Typevalue,texture, fontSize, lineSpace, lineSpaceUnit, fontWeight, readColor });
        }, 100);
        return () => {
            clearTimeout(timer)
        }
    }, [Typevalue, texture, fontSize, readColor, lineSpace, lineSpaceUnit, fontWeight]);


    return (
        <div style={{ padding: '0 16px', paddingBottom: 8 }}>
            <Title level={3}>
                字体设置
            </Title>
            <Title level={4}>
                大小
            </Title>

            <Row>
                <Col span={12}>
                    <Slider
                        min={7}
                        max={32}
                        value={fontSize}
                        onChange={setfontSize}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={7}
                        max={32}
                        style={{ margin: '0 16px' }}
                        value={fontSize}
                    />
                </Col>
            </Row>
            <Title level={4}>
                行间距
            </Title>
            <Text type="secondary">最小为1，0为自动</Text>
            <Row>
                <Col span={12}>
                    <Slider
                        min={0}
                        max={32}
                        value={lineSpace}
                        onChange={setlineSpace}
                    />
                </Col>
                <Col span={12}>
                    <InputNumber
                        min={0} max={32}
                        value={lineSpace}
                        addonAfter={(<SelectAfter defaultValue={lineSpaceUnit} onChange={setlineSpaceUnit} />)}
                        onChange={value => { setlineSpace(value ? value : 1) }}
                        defaultValue={1} />
                </Col>
            </Row>
            <Title level={4}>
                字体
            </Title>
            <Typeface />
            <br />
            <Title level={5}>
                字体预览：{TypefaceName}
            </Title>
            <Title level={4}>
                字体粗细
            </Title>
            <Radio.Group onChange={e => {
                setfontWeight(e.target.value)
            }} defaultValue={fontWeight}>
                <Radio.Button value="lighter">细</Radio.Button>
                <Radio.Button value="normal">标准</Radio.Button>
                <Radio.Button value="bold">粗</Radio.Button>
                <Radio.Button value="bolder">加粗</Radio.Button>
            </Radio.Group>
            <Title level={3}>
                页面主题
            </Title>
            <Title level={4}>
                背景颜色
            </Title>
            <Text type="secondary">
                选择颜色后，页面字体、背景等颜色都会智能匹配。
            </Text>
            <Radio.Group defaultValue={readColor} onChange={e => {
                setreadColor(e.target.value)
            }}>
                {readColorL.map(data => (
                    <Radio key={data.value} style={{ flexDirection: 'column-reverse', lineHeight: 0 }} value={data.value}>
                        <div style={{
                            backgroundColor: data.Color,
                            borderRadius: '50%',
                            marginBottom: 8,
                            height: 26,
                            width: 26,
                        }} />
                    </Radio>
                ))}
            </Radio.Group>

            <Row align="middle">
                <Col flex='1 1 auto'>
                    <Title level={4} style={{margin:'12px 0'}}>
                        背景纹理
                    </Title>
                </Col>
                <Col  flex='0 0 auto' span={8}>
                    <Switch defaultChecked={texture} onChange={settexture} />
                </Col>
            </Row>


        </div>

    )
}