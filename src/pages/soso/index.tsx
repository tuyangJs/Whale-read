
import QueueAnim from 'rc-queue-anim';
import BookBoxM from '@/pages/bookBox/main';
import styles from '@/pages/index.less';
import Details from '@/pages/diydemo/details';
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useLocation, history } from 'umi';
import sbook from './so';
import Loading from '@/assets/Loading.json'
import Error from '@/assets/404.json'
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
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

document.title = '在线搜索'
const DocsPage = () => {
    let location = useLocation() //取路由搜索参数
    const params = new URL(`https://tt.cn${location.search}`).searchParams;
    const soname = params.get("value")
    const [animation, setanimation] = useState<object>(Loading);
    const [ShowDrawer, setShowDrawer] = useState<boolean>(false);
    const [page, setpage] = useState(1);
    const [bookIntr, setbookIntr] = useState<object>({});
    const [Bookbody, setBookbody] = useState([]);
    const [sosoVua, sosomenu] = useState(itemsA[0].label);
    const [errorTxt, seterrorTxt] = useState(<Title level={4}>努力搜索中 {soname}</Title>)
    const LottieRef = useRef<LottieRefCurrentProps>(null)
    async function soBook(name: string | null, webpage: number) {
        // 检查name是否为空，如果是则直接返回
        if (!name) return;
        sobook(name, webpage, (data) =>
            // 判断data是否是对象，并且是否有statusCode属性
            typeof data === "object" && data?.statusCode != undefined
                ? // 如果是，说明搜索出错，打印错误信息并设置动画和文本
                (
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
                    setBookbody(data), Errorbook(name)
                )
        );
    }
    const Errorbook = (bookname: string) => {
        setanimation(Error),
            seterrorTxt(
                <>
                    <Title level={4}>{`【${bookname}】什么都没有搜到，换一个关键词试试吧`}</Title>
                </>
            )
    }
    useEffect(() => {
        let tims: any = null
        window.addEventListener('focus', function () {
            // 当窗口获得焦点时触发的操作
            if (tims) clearInterval(tims)
            LottieRef?.current?.setSpeed(1)
            LottieRef?.current?.play()
        });

        window.addEventListener('blur', function () {
            // 当窗口失去焦点时触发的操作
            let Speed = 0.99
            tims = setInterval(() => {
                if (Speed <= 0) {
                    clearInterval(tims);
                    LottieRef?.current?.pause()
                    return
                }
                LottieRef?.current?.setSpeed(Speed)
                Speed = Speed - 0.01
            }, 18);
        });
        history.listen(async (e) => { //路由更新事件
            const sparams = new URL(`https://tt.cn${e.location.search}`).searchParams;
            const ssoname = sparams.get("value")
            setanimation(Loading)
            seterrorTxt(
                <>
                    <Title level={4}>正在努力搜索中...</Title>
                </>
            )
            setBookbody([])
            soBook(ssoname, page)
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

    const Intr = (id: number, key: number, callBack: (int: any) => void) => {
        intbook(id, data => {
            let bookdata = Bookbody
            bookdata[key].intr = data
            setBookbody(bookdata)
            callBack(bookdata[key].intr)
        })
    }
    const LoadAnimation: React.FC = () => (
        <>
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
                    {Bookbody.map((book, i) => {
                        return (
                            <div key={'book-' + i}>
                                <BookBoxM
                                    onclick={(data: object) => {
                                        // setShowDrawer(true)
                                        // setbookIntr(data)
                                    }}
                                    bookinfo={book}
                                    onShow={(id, callBack: (int: any) => void) => {
                                        Intr(Number(id), i, callBack)
                                    }} />
                            </div>
                        );
                    })}
                </QueueAnim>
            </div></>
    )

    return (
        <div style={{ height: 'inherit', }}>
            <Details bookData={bookIntr} open={ShowDrawer} setOpen={setShowDrawer} />
            {(Bookbody.length < 1) ? (
                <QueueAnim type='scale' style={{ height: 'inherit' }} forcedReplay={false}>
                    <div
                        key='a'
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

                        <Lottie lottieRef={LottieRef} animationData={animation} loop={true} />
                        {errorTxt}
                        <Button type="primary" onClick={history.back} shape="round" >
                            返回
                        </Button>
                    </div>
                </QueueAnim>

            ) :
                <LoadAnimation />
            }

        </div>

    );
};

export default DocsPage;
