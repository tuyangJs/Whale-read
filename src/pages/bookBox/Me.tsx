import { Typography, Card } from 'antd'
import React, { useRef, useState } from 'react'
import './me.less'
const { Title, Text, Paragraph } = Typography;
const { Grid } = Card
export class BookSimpleInfo {
    title!: string;
    readed!: string;
    author!: string
    chapter!: string;
    id?: string;
    cover?: string;
    state!: number;
    intr!: string;
}
const Presets = [
    { color: 'Presets', state: '连载' },
    { state: '完结', color: 'purple' },
    { state: '断更', color: 'yellow' }
]

function MeBookBox(props: { bookSimpleinfo: BookSimpleInfo }) {
   
    const { title, author, state, cover, intr } = props.bookSimpleinfo
    const [Imgurl, setImgurl] = useState<string>(cover ? cover : '');
    const [titeShow, setTiteShow] = useState<boolean>(false);
    const styles = { "--imgurl": `url(${Imgurl})` } as React.CSSProperties;
    const stateColor = (state === 0) ? '#606060' : '#ff5e00'
    const imgbox = (
        <>
            <div className="moleskine-notebook">
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

        </>
    )


    return imgbox


}

export default MeBookBox
