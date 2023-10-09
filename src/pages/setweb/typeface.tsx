import { Cascader } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';
import React, { memo, useState } from 'react';
import { useLocation } from 'umi';
interface Option {
    value: string;
    label: string;
    children?: Option[];
    disabled?: boolean;
}


const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
        (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

interface ModalReturn {
    Typeface: React.FC;
    typefaceName: any
}
const typefaces = Hive.filedata('typeface')
const App = (): ModalReturn => {
    let compatibility = false
    const location = useLocation()
    if (location.pathname === '/setweb') {
        compatibility = true
    }

    const options: Option[] = [
        {
            value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
            label: "系统默认",
        },
        {
            value: 'HarmonyOS_Sans',
            label: 'HarmonyOS_Sans',
            children: [
                {
                    label: '极细',
                    value: 'HarmonyOS_Sans_Thin',
                },
                {
                    label: '标准',
                    value: 'HarmonyOS_Sans_Light',
                },
                {
                    label: '手机标准',
                    value: 'HarmonyOS_Sans_Regular',
                },
                {
                    label: '加粗',
                    value: 'HarmonyOS_Sans_Medium',
                },
                {
                    label: '超粗',
                    value: 'HarmonyOS_Sans_Bold',
                },
            ]
        },
        {
            value: 'Alimama',
            label: compatibility ? '阿里妈妈（不兼容）' : '阿里妈妈',
            disabled: compatibility,
            children: [
                {
                    label: '方圆体',
                    value: 'Almama_Cuboid',
                },
                {
                    label: '刀隶体',
                    value: 'Almama_DaoLi',
                },
                {
                    label: '东方大楷',
                    value: 'Almama_DFdakai',
                },
                {
                    label: '数黑体',
                    value: 'Almama_NumberBlack',
                }
            ]
        },
    ];
    const [typefaceNames, setypefaceNames] = useState(typefaces)
    const [value, setValue] = useState(typefaces.values)
    const onChange = (values: any, sop: any) => {
        setValue(values)
        setypefaceNames({ values: values, sop: sop })
    }
    const Exbom: React.FC = () => (
        <Cascader
            style={{ width: 220 }}
            options={options}
            onChange={onChange}
            value={value}
            allowClear={false}
            placeholder="点击选择字体"
            showSearch={{ filter }}
        />
    )

    return { Typeface: memo(Exbom), typefaceName: typefaceNames }
}

export default App