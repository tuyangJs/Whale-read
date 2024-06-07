import { Cascader, Input } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';
import React, { memo, useEffect, useRef, useState } from 'react';
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
    TypefaceName: any
    Typevalue: any
}
type props = {
    typefaces: any
}

const App = (prop: props): ModalReturn => {
    const typefaces = prop.typefaces
    /*   let compatibility = false
      const location = useLocation()
      if (location.pathname === '/setweb') {
          compatibility = true
      } */

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
                    value: 'Thin',
                },
                {
                    label: '标准',
                    value: 'Light',
                },
                {
                    label: '手机标准',
                    value: 'Regular',
                },
                {
                    label: '加粗',
                    value: 'Medium',
                },
                {
                    label: '超粗',
                    value: 'Bold',
                },
            ]
        },
        {
            value: 'FST',
            label: '仿宋体',
            children: [
                {
                    label: '朝鲜日报明朝体',
                    value: 'ChaoXianRiBaoMingChaoTi',
                },
                {
                    label: '汉字之美仿宋GBK',
                    value: 'HanZiZhiMeiFangSongGBK',
                },
            ]
        },
        {
            value: 'KT',
            label: '楷体',
            children: [
                {
                    label: '段宁毛笔小楷',
                    value: 'DuanNingMaoBiXiaoKai',
                },
                {
                    label: '汉仪跃晰褚楷 简',
                    value: 'HYYueXiChuKaiJ',
                },
            ]
        },
        {
            value: 'XKT',
            label: '行楷',
            children: [
                {
                    label: '陈爱军硬笔行楷_GB2312',
                    value: 'ChenAiJunYingBiXingKaiJian',
                },
            ]
        },
    ];
    const [typefaceNames, setypefaceNames] = useState<any>()
    function findLabelsByValues(valuesToFind: string[]) {
        const valuesToFinds = valuesToFind
        const foundLabels: string[] = [];
        function findLabelRecursively(option: Option, values: string[]) {
            if (values.length === 0) {
                return; // 所有值都已经查找完毕，不再继续查找
            }
    
            if (values.some(value => option.value.includes(value))) {
                foundLabels.push(option.label);
                valuesToFind = valuesToFind.filter(value => !option.value.includes(value)); // 移除已匹配的值
            }
    
            if (option.children) {
                for (const child of option.children) {
                    findLabelRecursively(child, valuesToFind);
                }
            }
        }
    
        for (const option of options) {
            findLabelRecursively(option, valuesToFind);
        }
    
        return (
            <Input
                bordered={false}
                style={{ fontFamily: `${valuesToFinds[0]}${(valuesToFinds.length > 1) ? '_' + valuesToFinds[valuesToFinds.length - 1] : ''}`}}
                value={foundLabels.join('_')}
                placeholder="输入文本预览效果"
            />
        );
    }
    


    const [value, setValue] = useState(typefaces)
    useEffect(() => {
        setypefaceNames(findLabelsByValues(value))

    }, [])
    const onChange = (values: any, osp: any) => {
        setValue(values)
        setypefaceNames(findLabelsByValues(values))
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

    return { Typeface: memo(Exbom), Typevalue: value, TypefaceName: typefaceNames }
}

export default App