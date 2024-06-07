import { Input, Button, Row, Col, Typography, AutoComplete } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import { history } from 'umi';
import { memo, useEffect, useRef, useState } from 'react';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
const { Title } = Typography;
const { Search } = Input;
function HeaderBody(props: any) {
    const { collapsed, TabMenu } = props.getSonMsg
    let sohistory = Hive.filedata('sohistory')
    const [data, setData] = useState<any>(sohistory ? sohistory : [])
    const [webGo, setwebGo] = useState<boolean[]>([false, false])
    const newcolor = async (newValue: string) => { //保存搜索记录
        const options = data
        // 查找新值在数组中的索引
        const index = options.findIndex((option: { value: string }) => option.value === newValue);

        // 如果新值已存在于数组中
        if (index !== -1) {
            // 移除已存在值并将其添加到数组的开头
            options.splice(index, 1);
            options.unshift({ value: newValue });
        } else {
            // 如果新值不存在于数组中，添加到数组
            options.unshift({ value: newValue });
        }

        // 如果数组长度超出，删除末尾的成员
        if (options.length > 10) {
            options.pop(); // 删除最后一个成员，保持数组长度不超过30
        }
        await Hive.filedata('sohistory', options)
        setData(options)
    }

    Hive.soText((soText: string) => {
        onSearch(soText)
    })
    const onSearch = (value: string) => {
        if (value) {
            newcolor(value)
            history.push('/soso?value=' + encodeURI(value))
        }
    }
    const [title, settitle] = useState<string>('鲸阅言文');


    const setCollapsed = TabMenu
    const [ShowHamburg, setShowHamburg] = useState(true)
    useEffect(() => {
        const updateWebGo = async () => {
            const [canGoForward, canGoBack] = await Promise.all([
                Hive.contents('canGoForward'),
                Hive.contents('canGoBack'),
            ]);

            setwebGo([canGoForward, canGoBack]);
        }
        Hive.ontitle((titles: string) => {
            settitle(titles);
        });

        history.listen((e) => {
            if (e.location.pathname === '/read') {
                setShowHamburg(false);
            } else if (ShowHamburg === true) {
                setShowHamburg(true);
            }
            updateWebGo();
        });

    }, [setShowHamburg, settitle, ShowHamburg]);



    return (
        <div style={{ marginTop: 2 }}>
            <QueueAnim className="queue-simple" type='scaleY' delay={500}  >
                <Row key='a'>
                    <Col flex="1 1 60px" style={{ display: 'flex', minWidth: 72, maxWidth: '100%' }}>
                        {webGo[1] && (
                            <Button
                                key='b'
                                type="text"
                                size="middle"
                                icon={<LeftCircleOutlined style={{ marginTop: 3 }} />}
                                className={styles.Header_region_no}
                                onClick={history.back}
                                shape="circle"
                                style={{ marginTop: 8, marginLeft: 4 }}
                            />
                        )}
                        {webGo[0] && (
                            <Button
                                key='c'
                                type="text"
                                size="middle"
                                icon={<RightCircleOutlined style={{ marginTop: 3 }} />}
                                className={styles.Header_region_no}
                                onClick={history.forward}
                                shape="circle"
                                style={{ marginTop: 8, marginLeft: 4 }}
                            />
                        )}
                        <Title ellipsis={true} key='d' level={5} style={{ margin: '12px 8px' }}>

                            {title}
                        </Title>
                    </Col>
                    <Col flex="0 1 auto" >
                        <div style={{ marginTop: 8, display: 'flex' }} className='styles.Header_region_no'>
                            {ShowHamburg ? (
                                <AutoComplete
                                    popupClassName="certain-category-search-dropdown"
                                    popupMatchSelectWidth={200}
                                    style={{ width: 250 }}
                                    options={data}
                                    onSelect={value => {
                                        onSearch(value)
                                    }}
                                    maxLength={28}
                                >
                                    <Search
                                        className={styles.Header_region_no}
                                        placeholder="输入书名或者作者试试看~"
                                        onSearch={onSearch}
                                        style={{ marginLeft: 10, maxWidth: 220 }}
                                    />
                                </AutoComplete>)
                                : null}
                            {props.children ? props.children : null
                            }
                        </div>

                    </Col>
                    <Col flex="0 1 138px" />
                </Row>
            </QueueAnim>

        </div>
    )
}
export default memo(HeaderBody) 