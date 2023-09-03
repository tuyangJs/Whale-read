import { Typography, Card } from 'antd'
import React, { useState } from 'react'
const { Title, Text, Paragraph } = Typography;
const { Grid } = Card
export class BookSimpleInfo {
    title!: string;
    readed!: string;
    chapter!: string;
    id?: string;
    state?: number | null;
    cover?: string;
  }
 const Presets = [
  { color: 'Presets', state: '连载' },
  { state: '完结', color: 'purple' },
  { state: '断更', color: 'yellow' }
] 
export default function MeBookBox(props: { bookSimpleinfo: BookSimpleInfo }) {
    const [loading, setLoading] = useState(true);
    const onChange = (checked: boolean) => {
        setLoading(!checked);
    };
   // console.log("202030903002",props.bookSimpleinfo);
    const { title, readed, chapter, state,cover } = props.bookSimpleinfo
    return (
        <a href='./read?key=a'>
            <Card
                hoverable
                style={{ width: 165 }}
                type='inner'
                bordered={false}

            >
                <Grid style={{ padding: 0, width: '100%', boxShadow: 'none' }}>
                    <img style={{
                        margin: 8,
                        width: '-webkit-fill-available',
                        height: 'calc(100% - 16px)',
                        borderRadius: 8
                    }} alt="example" 
                    //src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                    src={cover} />
                </Grid>
                <Grid style={{ padding: '4px 4px', width: '100%', boxShadow: 'none', textAlign: 'center' }}>
                    <>
                        <Title level={5} style={{ margin: '2px 0px' }}>{title}</Title>
                        <Text >{readed}/{chapter}</Text>

                    </>

                </Grid>
            </Card>
        </a>

    )
}