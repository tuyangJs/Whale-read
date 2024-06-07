import { Card, Layout, Row, Col, Typography, Flex, Button, Tooltip, Skeleton, Drawer, ConfigProvider, Spin } from 'antd';
import { useLocation, useOutletContext } from 'umi';
import "./idnex.less"
import { useCallback, useEffect, useRef, useState } from 'react';
import Analysis from './analysis'
import ChapterBox from './chapterBox'
import { LineHeightOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Sbr from '@/layouts/function/Sbr'
import Pset from './set'
import '@/layouts/typeface.less'
import Smooth from '@/layouts/function/Sbr'
import { ThemeConfig } from 'antd/es/config-provider';
import textureImg from '@/assets/texture.png'
const { Text, Paragraph } = Typography;
//阅读页面组件

const { Header, Content } = Layout;
type flow = {
    id: string;
    href: string;
    mediaType: string;
    title: string;
    order: number;
    level: number;
}

const bodyStyle: React.CSSProperties = {
    minHeight: '100%',
    overflow: 'hidden',
    padding: 0,

}
const figureStyle: React.CSSProperties = {
    userSelect: 'text',
    columnCount: 2,
    maxHeight: 'calc(100vh - 106px)',
    height: '100%',
    overflow: 'hidden',
    columnGap: 60,
    columnFill: 'auto',
    margin: '0px 12px',
}
// 防抖
let timer: string | number | NodeJS.Timeout | undefined

type cgType = {
    fontWeight?: string;
    Typevalue?: any,
    fontSize?: number,
    lineSpace?: number,
    lineSpaceUnit?: string,
    readColor?: number,
    texture?: boolean
}
const typefaceDef =  //字体默认配置
    [
        "HarmonyOS_Sans",
        "Light"
    ]

const readColorL = [
    { value: 0, Color: '#ebebeb' },
    { value: 1, Color: '#ebe6da' },
    { value: 2, Color: '#c9e0cb' },
    { value: 3, Color: '#f6efef' },
    { value: 4, Color: '#cedde1' },
    { value: 5, Color: '#e3d0a1' },
]


export default function HomePage(props: any) {
    const { setHDras, setlayColor } = useOutletContext();//取数据
    const location = useLocation() //取路由搜索参数
    const params = new URL(`https://tt.cn${location.search}`).searchParams;
    const Bookname = params.get("name")
    const Bookfile = params.get("file")
    document.title = Bookname ? Bookname : '未知书籍'

    const [Flow, setflow] = useState<flow[]>([]);
    const [Chapter, setChapter] = useState<number>(0); //章节
    const [ChapterId, setChapterId] = useState<any>(null); //章节ID配置
    const [EPubs, setEPubs] = useState<any>(null);
    const [NumberPs, setNumberPs] = useState<number>(0);//书籍页数
    const [Booktite, setBooktite] = useState<string>('第一章');//书籍标题
    const [BookDom, setBookDom] = useState<any>();//书籍dom
    const [open, setOpen] = useState(false);
    const [theme, settheme] = useState<ThemeConfig>({});
    const [drawerBody, setdrawerBody] = useState<any>();
    const [drawerTile, setdrawerTile] = useState<string>();
    const firstCardRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [config, setConfig] = useState<cgType>(
        Hive.filedata('ReadConfig') ? Hive.filedata('ReadConfig') : {
            Typevalue: typefaceDef,
            fontSize: 15,
            lineSpace: 0,
            lineSpaceUnit: '',
            fontWeight: "normal",
            readColor: 0,
            texture: true
        }
    );
    const bookIDurl = EPubs ? EPubs.metadata.title + '-' + EPubs.metadata.UUID : ''

    useEffect(() => {
        //获取书籍信息
        Hive.GetBooks(Bookfile, (EPub: any) => {
            const { flow } = EPub
            setflow(flow)
            setEPubs(EPub)
        })
        return
    }, [])
    useEffect(() => {
        if (!EPubs) return
        //载入进度
        const bookIDurls = EPubs.metadata.title + '-' + EPubs.metadata.UUID
        const { Chapters, NumberPss } = Hive.getBookSchedule(bookIDurls)
        setChapter(Chapters)
        setNumberPs(NumberPss)
        setTimeout(() => {
            handleKeyUp(null, NumberPss)
        }, 550)
        return
    }, [EPubs])
    useEffect(function () {//切换章节，载入章节
        if (Flow.length < 1) return
        setBooktite(ChapterId.title)
        try {
            const lineSpace = `${((config.lineSpace ? config.lineSpace : 0) < 1) ? '' : config.lineSpace}${config.lineSpaceUnit}`
            const { fontWeight } = config
            const datac = { lineSpace, fontWeight }
            Hive.GetBooks(Bookfile, ChapterId.id, function (err: any) {
                Analysis(err,
                    bookIDurl,
                    setBooktite,
                    datac,
                    text => {
                        if (firstCardRef.current)
                            firstCardRef.current = text
                        setBookDom(text)
                    }
                )
            })

        } catch (error) {
        }


    }, [ChapterId, firstCardRef, config])
    useEffect(function () { //切换章节，获取章节信息
        const { current } = firstCardRef
        if (!current) return
        if (Flow.length < 1) return
        const chapters = (Chapter >= 0) ? Chapter : 0
        setBooktite(`${Flow[chapters].title ? Flow[chapters].title : `第${chapters + 1}章`}`)
        setChapterId(Flow[chapters])
    }, [Chapter, Flow])

    const handleKeyUp = (event?: KeyboardEvent | null, Numbers?: number) => { //翻页
        const { current } = firstCardRef
        if (!current) return
        const sWitch = current.offsetWidth + 60
        const remainingS = current.scrollWidth - current.clientWidth - current.scrollLeft
        const remainingR = current.scrollLeft
        if (Numbers) {
            const sWitch = (current.offsetWidth + 60) * Numbers
            current.scrollLeft = (sWitch === 60) ? 0 : sWitch
            return
        }
        if (!event) return
        if (event.key === 'ArrowLeft') {
            if (remainingR < 1) { //尝试翻章
                if (Chapter > 0) {
                    setChapter(Chapter - 1)
                    current.scrollLeft = current.scrollWidth + 999
                }
                return
            }
            setNumberPs(NumberPs - 1)
            current.scrollLeft -= sWitch
            if (current.scrollLeft < 1) {
                console.log('首页');
                setNumberPs(0)
            } else {

            }
        } else if (event.key === 'ArrowRight') {
            // 计算横向滚动条的剩余可滚动距离
            const remainingScrollDistance = current.scrollWidth - current.clientWidth - current.scrollLeft;

            if (remainingS < 1) { //尝试翻章
                console.log(Chapter, Flow.length);
                if (Chapter < Flow.length) {
                    setChapter(Chapter + 1)
                    current.scrollLeft = 0
                    setNumberPs(0)
                }
                return
            }
            current.scrollLeft += sWitch
            setNumberPs(NumberPs + 1)
            if (remainingScrollDistance < 1) {
                console.log('尾页');
            }

        }

    };
    useEffect(() => {
        const debouncedSearch = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const { current } = firstCardRef
                if (!current) return
                const sWitch = (current.offsetWidth + 60) * NumberPs
                current.scrollLeft = (sWitch === 60) ? 0 : sWitch

            }, 10)
        }
        //保存阅读进度
        Hive.getBookSchedule(bookIDurl, { NumberPss: NumberPs, Chapters: Chapter })
        Headers()
        window.addEventListener('resize', debouncedSearch);
        window.addEventListener('keyup', handleKeyUp);
        // 清除事件监听以避免内存泄漏
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('resize', debouncedSearch);
            setHDras()//注销组件
        };
    }, [NumberPs, Chapter, firstCardRef, Flow]);
    //注册标题栏组件
    const Headers = () => {
        setHDras(
            <><Tooltip title="章节列表  [ `~ ]" placement='bottom'>
                <Button type="text"
                    size='middle'
                    icon={<UnorderedListOutlined />}
                    onClick={() => { showDrawer(0) }}
                    shape="circle"

                >
                </Button>
            </Tooltip>
                <Tooltip title="阅读设置  [ F1 ]" placement='bottom'>
                    <Button type="text"
                        size='middle'
                        icon={<LineHeightOutlined />}
                        onClick={() => { showDrawer(1) }}
                        shape="circle"
                    >
                    </Button>
                </Tooltip></>
        )
    }



    //页面配置
    const onSet = (data: cgType) => {
        let newConfig: cgType = { ...config };
        for (const [key, value] of Object.entries(data)) {
            newConfig[key as keyof cgType] = value as any;
        }
        Hive.filedata('ReadConfig', newConfig)
        setConfig(newConfig);
    };
    useEffect(() => {//更新页面配置、渲染阅读主题
        if (!config) return
        const { Typevalue, fontWeight, fontSize, readColor } = config;
        if (!Typevalue) return

        const colorText = setlayColor(readColorL[readColor ? readColor : 0]?.Color)
        const updatedTheme = {
            ...theme,
            token: {
                fontFamily: `${Typevalue[0]}${(Typevalue.length > 1) ? '_' + Typevalue[Typevalue.length - 1] : ''}`,
                fontSize: fontSize,
                fontWeightStrong: fontWeight,
                colorText: colorText,
            }
        } as ThemeConfig;
        settheme(updatedTheme);

        return () => {
            setlayColor()
        }
    }, [config]);


    const showDrawer = (type: number) => {
        setOpen(true);
        switch (type) {
            case 0:
                const zs = (
                    <div>
                        <Sbr style={{ maxHeight: 'calc(100vh - 46px)' }}>
                            <ChapterBox onChange={i => {
                                firstCardRef.current.scrollLeft = 0
                                setNumberPs(0)
                                setChapter(Flow.indexOf(i))
                            }} style={{ padding: '0 8px' }} Chapter={Chapter} data={Flow} />
                        </Sbr>
                    </div >
                );
                setdrawerBody(zs)
                setdrawerTile('章节列表')
                break;
            case 1:
                setdrawerBody(<Pset onChange={onSet} config={config} />)
                setdrawerTile('阅读设置')
                break;
        }

    };

    const onClose = () => {
        setOpen(false);
    };
    const Style: React.CSSProperties = {
        width: '50%',
        minHeight: '100%',
        overflow: 'hidden',
        padding: 0,
        backgroundImage: config.texture ? `url(${textureImg})` : ''
    }
    // 其他组件逻辑
    return (
        <Content style={{
            padding: '0px 8px 6px 8px',
            height: '100%',
            borderRadius: '12px 0 0 0',

        }}  >
            <Drawer title={drawerTile}
                styles={{ body: { padding: 0 }, header: { height: 46 } }}
                placement="right"
                closeIcon={null}
                onClose={onClose}
                open={open}>
                <Smooth style={{ height: ' calc(100vh - 46px)', }}>
                    {drawerBody}
                </Smooth>

            </Drawer>
            <Flex gap="middle" vertical={false} style={{ minHeight: '100%', maxHeight: '100%' }} ref={contentRef}>
                {['Ca','Cb'].map(dnr=>
                     (
                        <Card style={Style} bodyStyle={{ ...bodyStyle }} className={`body${dnr}`} />
                     )
                )}
                <div style={{
                    position: 'absolute',
                    left: 9,
                    width: ' calc(100% - 18px)',
                    padding: 12
                }}>
                    <Text>
                        {Booktite}
                    </Text>
                    <ConfigProvider theme={theme}>
                        <figure style={{ margin: 0 }}>
                            <Paragraph ref={firstCardRef} style={figureStyle}>
                                {BookDom ? BookDom : <Skeleton active />}
                            </Paragraph>
                        </figure>
                    </ConfigProvider>
                </div>
            </Flex>
        </Content >

    );
}




