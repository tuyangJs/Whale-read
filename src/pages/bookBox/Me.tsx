import { Typography, Flex } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { history } from 'umi';
import './me.less'
const { Title, Text, Paragraph } = Typography;
type BookSimpleInfo = {
    title: string; //书名
    author: string; //作者
    readed: number; //阅读进度
    chapter: number;//章节总数
    date: string; //出版日期
    state: number;//状态
    intr: string;//简介
    cover: string;//封面
    grouping: string//分组
    id: string//UUID
    Bookfile:string
}
const Presets = [
    { color: 'Presets', state: '连载' },
    { state: '完结', color: 'purple' },
    { state: '断更', color: 'yellow' }
]

function MeBookBox(props: { bookSimpleinfo: BookSimpleInfo }) {

    const { title, author, state, cover, intr, grouping, id,Bookfile} = props.bookSimpleinfo
    const [Imgurl, setImgurl] = useState<string>(cover ? cover : '');
    const [titeShow, setTiteShow] = useState<boolean>(false);
    const styles = { "--imgurl": `url(${Imgurl})`, backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties;
    const stateColor = (state === 0) ? '#606060' : '#ff5e00'
    useEffect(() => {
       const imgBase = Hive.getBookimg(title + '-' + id, cover)
        setImgurl(imgBase)
        setTiteShow(false)
    }, [setTiteShow])
    const openBook = () => {
        history.push({
            pathname: '/read',
            search: `?grouping=${grouping}&name=${title}&author=${author}&file=${Bookfile}`
        })
    }
    const imgbox = (
        <Flex vertical={true} align='center' gap={10}>
            <div className="moleskine-notebook" onClick={openBook}>
                <div className="notebook-cover " style={styles}>
                    <img style={{ display: 'none' }} src={Imgurl} onError={(e) => {
                        setTiteShow(true)
                    }} alt="" />
                    <div className="notebook-skin" style={{ backgroundColor: stateColor }}>{
                        (state === 0) ? '未读' : '更新'
                    }</div>
                    {!titeShow ? null : <figure className='cntext' style={{
                        right: 0,
                        position: 'inherit',
                    }}>
                        <Title level={5} style={{ margin: 0, color: '#000000d9' }}>{title}
                            <br />
                            <Text style={{ textAlign: 'end', display: 'inherit' }} type="secondary">{author} · 著</Text>
                        </Title>
                    </figure>}
                </div>
                <ul className="notebook-page" >
                    <li className='cntext'>
                        <figure style={{ margin: 12, color: '#000 ' }} >
                            <Title level={5} style={{ margin: 0, color: '#000000d9' }}>{title}
                                <br />
                                <Text style={{ textAlign: 'end', display: 'inherit', color: '#00000073' }} type="secondary">{author} · 著</Text>
                            </Title>

                            <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0, color: '#000000d9' }} >
                                {intr}
                            </Paragraph>
                        </figure>

                    </li>
                    <li>
                    </li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

            </div>
            <Text ellipsis={true} style={{ margin: 0, maxWidth: 165 }}>
                {title}
            </Text>
        </Flex>
    )


    return imgbox


}

export default MeBookBox
