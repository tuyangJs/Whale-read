
import QueueAnim from 'rc-queue-anim';
import BookBoxM from '@/pages/bookBox/main';
import styles from '@/pages/index.less';
import Modal from './bookModal';
import { useCallback, useEffect, useState } from 'react';
import { Button, Dropdown, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useLocation, history } from 'umi';
import sbook from './so';
import Loading from '@/assets/Loading.json'
import Error from '@/assets/404.json'
import Lottie from "lottie-react";
const { Title, Text } = Typography;
const { sobook, intbook } = sbook
//搜索框设置
const itemsA = [
    {
        label: '智能搜索',
        key: 0,
    }
]
const items: MenuProps['items'] = itemsA
var timer: any


const DocsPage = () => {
    let location = useLocation() //取路由搜索参数
    const params = new URL(`https://tt.cn${location.search}`).searchParams;
    const soname = params.get("value")
    if (soname) {
        document.title = '在线搜索 - ' + soname
    } else {
        document.title = '在线搜索'
    }
    const [animation, setanimation] = useState<object>(Loading);
    const [page, setpage] = useState(1);
    const [Bookbody, setBookbody] = useState([]);
    const [sosoVua, sosomenu] = useState(itemsA[0].label);
    const [errorTxt, seterrorTxt] = useState(<Title level={4}>努力搜索中 {soname}</Title>)
    async function soBook(name: string | null, webpage: number) {
        // 检查name是否为空，如果是则直接返回
        if (!name) return;
        await sobook(name, webpage, (data) =>
            // 判断data是否是对象，并且是否有statusCode属性
            typeof data === "object" && data?.statusCode != undefined
                ? // 如果是，说明搜索出错，打印错误信息并设置动画和文本
                (
                    console.log("错误"),
                    setanimation(Error),
                    seterrorTxt(
                        <>
                            <Title level={4}>搜索出现错误</Title>
                            <Text type="danger">{data?.statusCode}</Text>
                        </>
                    )
                )
                : // 如果不是，说明搜索成功，打印成功信息并设置Bookbody为data
                (
                    setBookbody(data), console.log("成功")
                )
        );
    }
    useEffect(() => {
        history.listen(async () => { //路由更新事件
            setanimation(Loading)
            seterrorTxt(
                <>
                    <Title level={4}>正在努力搜索中...</Title>
                </>
            )
            setBookbody([])
            soBook(soname, page)
        })
        if (soname) {
            soBook(soname, page)//首次进入页面时执行的操作
        } else {
            setanimation(Error),
                seterrorTxt(
                    <>
                        <Title level={4}>请在上方搜索栏输入，并按回车开始搜索</Title>
                    </>
                )
        }

    }, [soname, page])

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        sosomenu(itemsA[Number(e.key)].label)
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    const { Modals, show } = Modal()[0]

    return (
        <div style={{ height: 'inherit', }}>
            {(Bookbody.length < 1) ? (
                <div
                    style={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            flexDirection: 'column',
                            height: 'inherit',
                        }
                    }>
                    <Lottie animationData={animation} loop={true} />

                    {errorTxt}

                </div>
            ) :
                (<>
                    <div style={{ marginBottom: 12 }}>
                        <Dropdown menu={menuProps} className={styles.Header_region_no}>
                            <Button>
                                <Space>
                                    {sosoVua}
                                    <DownOutlined style={{ marginLeft: 10 }} />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                    <div style={{ margin: '0 auto' }}>
                        <QueueAnim className={'queue-simple ' + styles.cradFox} type='scale' forcedReplay={false} delay={10}>
                            <Modals />
                            {Bookbody.map((book, i) => {
                                return (
                                    <div key={'book-' + i}

                                    >
                                        <BookBoxM onclick={(data: any) => {
                                            show(data);
                                        }} bookinfo={book} intbook={intbook} />

                                    </div>
                                );
                            })}
                        </QueueAnim>
                    </div></>)
            }

        </div>

    );
};

export default DocsPage;
