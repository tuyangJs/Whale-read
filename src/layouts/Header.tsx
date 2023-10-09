import { Input, Button, Row, Col, Typography } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import Hamburgico from '../pages/diydemo/Hamburg'
import { history } from 'umi';
import { useEffect, useRef, useState } from 'react';
const { Title } = Typography;

const { Search } = Input;
const onSearch = (value: string) => {
    if (value) {

        history.push('/soso?value=' + encodeURI(value))
    }
}


function HeaderBody(props: any) {
    const { collapsed, TabMenu } = props.getSonMsg
    const bookRef = useRef<HTMLDivElement>(null);
    const [title, settitle] = useState<string | null>('鲸阅言文');
    useEffect(() => {
        Hive.ontitle((titles: string) => {
            settitle(titles)
            //  current.innerText = titles
        })
    }, [HeaderBody, settitle])


    const setCollapsed = TabMenu
    return (
        <div style={{ marginTop: 2 }}>
            <QueueAnim className="queue-simple" type='scaleY' delay={600}  >
                <Row key='a'>
                    <Col flex="1 1 60px" style={{ display: 'flex',minWidth:72,maxWidth:800 }}>
                        <Button
                            type="text"
                            icon={<Hamburgico expand={collapsed} />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 32,
                                height: 32,
                                marginTop: 8
                            }}
                            className={styles.Header_region_no}
                        />
                        <Title ellipsis={true} ref={bookRef} level={5} style={{ margin: '12px 8px' }}>
                            {title}
                        </Title>
                    </Col>
                    <Col flex="0 1 370px" >
                        <div style={{ marginTop: 8, marginRight: 10, display: 'flex' }} >
                            <Search  maxLength={28} className={styles.Header_region_no} placeholder="输入书名或者作者试试看~" onSearch={onSearch} style={{ marginLeft: 10, maxWidth: 220 }} />

                        </div>

                    </Col>
                </Row>
            </QueueAnim>

        </div>
    )
}
export default HeaderBody