import { Typography, Card } from 'antd'
import React, { useState } from 'react'
const { Title, Text, Paragraph } = Typography;
const { Grid } = Card
export default function MeBookBox() {
    const [loading, setLoading] = useState(true);
    const onChange = (checked: boolean) => {
        setLoading(!checked);
    };
    return (
        <a href='./read?key=a'>
            <Card
                hoverable
                style={{ width: 165 }}
                type='inner'
                bordered={false}

            >
                <Grid style={{ padding: 0, width: '100%', boxShadow: 'none' }}>
                    <img style={{ margin: 8, width: '-webkit-fill-available', height: 'calc(100% - 16px)', borderRadius: 8 }} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                </Grid>
                <Grid style={{ padding: '4px 4px', width: '100%', boxShadow: 'none', textAlign: 'center' }}>
                    <>
                        <Title level={5} style={{ margin: '2px 0px' }}>书籍标题</Title>
                        <Text >26章/562章</Text>

                    </>

                </Grid>
            </Card>
        </a>

    )
}