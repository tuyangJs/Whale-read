import React from "react";

import * as htmlparser from 'htmlparser2';
import { Typography, Image } from "antd";
const { Text, Paragraph } = Typography;
// 创建一个解析器
const attribsSp = {
    'viewbox': 'viewBox',
    'xlink:href': 'xlinkHref',
    'class': 'className',
    'xmlns:xlink': 'xmlnsXlink',
    'preserveaspectratio': 'preserveAspectRatio',

}
function replaceImageHref(htmlString: string,
    dataUrl: string, setBooktite: React.Dispatch<React.SetStateAction<string>>,
    data:any,
    callBack: (dom: any) => void): void {
    const handler = new htmlparser.DomHandler((error: Error | null, dom: any) => {
        if (error) {
            console.error('HTML Parsing Error', error);
        } else {
            const reactTree = convertToReact(dom,data);
            return reactTree;
        }
    });
  
    const parser = new htmlparser.Parser(handler, { decodeEntities: true });
    parser.write(htmlString);
    parser.end();

    function convertToReact(dom: any,data:any): JSX.Element[] {
        const {lineSpace,fontWeight} = data
        const updatedDom = dom.map((node: any, index: number) => {
            if (node.type === 'tag') {
                const children = convertToReact(node.children,data);
                const updatedProps = { ...node.attribs }; // 创建新的属性对象
                for (let key in attribsSp) {
                    const i = attribsSp[key]
                    updatedProps[i as keyof typeof updatedProps] = node.attribs[key as keyof typeof node.attribs];
                    delete updatedProps[key]; // 移除原属性
                }
                if (node.name === 'div') {
                    const title = node.attribs['data-chapter-title']
                    if (title) {
                        setBooktite(title)
                    }
                }
                if (node.name === 'image') {
                    const source = node.attribs['xlink:href'];
                    const imgBase = Hive.getBookimg(dataUrl, source)
                    updatedProps.xlinkHref = imgBase; // 添加新属性
                }
                // 处理 <br> 标签
                if (node.name === 'br') {
                    return <br key={index} />;
                }
                // 处理 <img> 标签
                if (node.name === 'img') {
                    const parts = node.attribs.src.split('/');
                    const fileName = parts[parts.length - 1];
                    const imgBase = Hive.getBookimg(dataUrl, fileName)
                    return <Image {...updatedProps} key={index} src={imgBase} />;
                }

                if (node.name === 'p') {
                    const customProps = { key: index, ...updatedProps };
                    
                    return <Paragraph
                        style={{ ...updatedProps.style, 
                            lineHeight:lineSpace?lineSpace:'',
                            textIndent: '2em',
                            fontWeight:fontWeight
                        }}
                        {...customProps}>
                        {children}
                    </Paragraph>;
                }

                const updatedNode = React.cloneElement(React.createElement(node.name, { key: index }, children), updatedProps);
                return updatedNode;
            } else if (node.type === 'text') {
                return node.data;
            }
            return null
        });

        return updatedDom.filter((node: any) => node !== null);
    }

    if (handler.dom.length > 0) {
        // Assuming the top-level element is at index 0
        callBack(convertToReact(handler.dom,data))
    } else {
        callBack(null);
    }

}


export default replaceImageHref;
