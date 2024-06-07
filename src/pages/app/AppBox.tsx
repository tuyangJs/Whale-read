import { Card, Tag } from "antd";
import React from "react";
import Appdficon from '@/assets/应用.svg'
interface APPinfo {
    name: string; // APP名称
    author: string; // 作者
    edition: string; // 版本
    logo: string; // 图标
    intro?: string; // 介绍
    tag?: string[]; // 标签
    url?: string[]; // 作者链接
    Appid?: string;
    key?: string | number
}
const AppBox: React.ForwardRefRenderFunction<HTMLDivElement, APPinfo> = ({ name, author, key, logo, tag, intro, Appid }) => {
    return (
        <Card
            key={key}
            hoverable={true}
            bodyStyle={{ margin: 16 }}
            style={{ height: 126, width: 328, borderRadius: 16 }}>
            <Card.Grid
                hoverable={false}
                key="Card_a"
                style={{ padding: 0, width: `${(1 / 4) * 100}%`, boxShadow: 'none' }}>
                <img
                    style={{
                        width: '-webkit-fill-available',
                        borderRadius: 18,
                        border: '1px solid rgba(187, 187, 187, 0.29)',
                    }}
                    src={logo} alt=""
                    onError={e => {
                        e.currentTarget.src = Appdficon;
                    }}
                />
            </Card.Grid>
            <Card.Grid
                key="Card_b"
                hoverable={false}
                style={{ width: `${(3 / 4) * 100}%`, padding: '0 0 0 8px', boxShadow: 'none' }} >
                <Card.Meta
                    title={name}
                    description={(<>
                        {intro}
                        <div style={{ marginTop: 5 }}>
                            {tag?.map((tagname,i) => (
                                <Tag key={`${tagname}_${i}`} color="blue">{tagname}</Tag>
                            ))}
                        </div>


                    </>)}
                />
            </Card.Grid>
        </Card>
    );
}

export { APPinfo, AppBox };
