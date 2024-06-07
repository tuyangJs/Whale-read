import { Card, Layout, Row, Col, Typography, Flex } from 'antd';
import { useLocation } from 'umi';
import "./idnex.less"
import { useCallback, useEffect, useRef, useState } from 'react';
import Analysis from './analysis'
const { Text } = Typography;
//阅读页面组件
const { Header, Content } = Layout;
type flow = {
  [x: string]: any;
  id: string;
  level: number
}
const Style: React.CSSProperties = {
  width: '50%',
  minHeight: '100%',
  overflow: 'hidden',
  padding: 16
}
const bodyStyle: React.CSSProperties = {
  minHeight: '100%',
  overflow: 'hidden',
  padding: 0
}
// 防抖
let timer: string | number | NodeJS.Timeout | undefined
// 检测内容是否超出容器
const checkOverflow = (divRef: HTMLDivElement | null): HTMLElement[] => {
  if (divRef) {
    const divElement = divRef;
    const children = Array.from(divElement.children);
    const windowHeight = window.innerHeight;

    // 创建一个变量来存储不完整可视的元素
    const invisibleElements: HTMLElement[] = [];

    children.forEach((child) => {
      const childRect = child.getBoundingClientRect();
      // 判断子元素是否部分可视，底部小于等于12px也算作溢出
      if (
        (childRect.top < 0 && childRect.bottom > 0) || // 上部分可视
        (childRect.top >= 0 && childRect.bottom > windowHeight - 12) // 下部分可视
      ) {
        invisibleElements.push(child as HTMLElement);
      }
    });

    return invisibleElements;
  }
  return [];
};



export default function HomePage(props: any) {
  const location = useLocation() //取路由搜索参数
  const params = new URL(`https://tt.cn${location.search}`).searchParams;
  const Bookname = params.get("name")
  const Bookfile = params.get("file")
  document.title = Bookname ? Bookname : '未知书籍'
  const [Flow, setflow] = useState<flow[]>([]);
  const [Chapter, setChapter] = useState<number>(Hive.filedata('chapter') ? Hive.filedata('chapter') : 0);
  const [EPubs, setEPubs] = useState<any>(null);
  const [chapterContent, setchapterContent] = useState<string[]>();//书籍内容
  const [moreBook, setmoreBook] = useState<string | null>();//书籍内容
  const [Booktite, setBooktite] = useState<string[]>(['第一章', '第一章']);//书籍标题
  useEffect(() => {
    //获取书籍信息
    Hive.GetBooks(Bookfile, (EPub: any) => {
      const { flow } = EPub
      setflow(flow)
      setEPubs(EPub)
      if (EPub) {
        const chapters = (Chapter >= 0) ? Chapter : 0
        try {
          Hive.GetBooks(Bookfile, flow[chapters].id, function (err: any) {
            Analysis(err,
              EPub.metadata.title + '-' + EPub.metadata.UUID,
              text => {
                setchapterContent([text])
              }
            )
          })
        } catch (error) {
        }

      }
    })

    return
  }, [])
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  function separateBook() {
    if (!firstCardRef.current) return
    const BodyA = checkOverflow(firstCardRef.current) //第一个容器处理
    if ((BodyA ? BodyA : []).length < 1) {//第二个容器没有内容的情况下处理
      if (secondCardRef.current && secondCardRef.current.children.length <= 1) {
        if (!Flow) return
        if (Flow.length < 1) return
        Hive.GetBooks(Bookfile, Flow[Chapter + 1].id, function (err: any) {
          Analysis(err,
            EPubs.metadata.title + '-' + EPubs.metadata.UUID,
            text => {
              if (secondCardRef.current) {
                secondCardRef.current.innerHTML = text
                const BodyB = checkOverflow(secondCardRef.current)
                BodyB?.forEach((element) => {
                  try {
                    secondCardRef.current?.appendChild(element);
                  } catch (error) {
                  }
                })
                setBooktite([`${Flow[Chapter].title ? Flow[Chapter].title : `第${Chapter + 1}章`} | 第一页`,
                `${Flow[Chapter].title ? Flow[Chapter].title : `第${Chapter + 2}章`} | 第一页`])
              }
            }
          )
        })
      }
    } else {//第一个有剩余内容情况的处理
      // 将不可见元素移动到第二个容器
      if (secondCardRef.current && firstCardRef.current.children.length > 1) {
        secondCardRef.current.innerHTML = ''
        BodyA?.forEach((element) => {
          try {
            secondCardRef.current?.appendChild(element);

          } catch (error) {
          }
        });
        setBooktite([`${Flow[Chapter].title} | 第一页`, `${Flow[Chapter].title} | 第二页`])
        const BodyB = checkOverflow(secondCardRef.current)
        BodyB?.forEach((element) => {
          try {
            secondCardRef.current?.removeChild(element);
          } catch (error) {
          }
        });
      }
    }
    return BodyA
  }


  const debouncedSearch = useCallback(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (firstCardRef.current && secondCardRef.current && moreBook) {
        firstCardRef.current.innerHTML = moreBook
        separateBook()
      }
    }, 200)
  }, [moreBook, firstCardRef, secondCardRef]);

  useEffect(() => {
    setTimeout(() => {
      if (chapterContent) {
        setmoreBook(chapterContent[0])
        separateBook()
      }
    }, 0);
    window.addEventListener('resize', debouncedSearch);
    // 在组件卸载时清除事件监听器
    return () => {
      window.removeEventListener('resize', debouncedSearch);
    };
  }, [debouncedSearch, chapterContent, moreBook]);

  // 其他组件逻辑


  return (
    <Content style={{ padding: 8, height: '100%', borderRadius: '12px 0 0 0' }} ref={contentRef}>
      <Flex gap="middle" vertical={false} style={{ minHeight: '100%', maxHeight: '100%' }}>
        <Card style={Style} bodyStyle={bodyStyle} className='bodycd' >
          <Text>
            {Booktite[0]}
          </Text>
          <figure dangerouslySetInnerHTML={{ __html: chapterContent ? chapterContent : '' }}
            style={{ margin: 12 }}
            ref={firstCardRef} />

        </Card>
        <Card style={Style} bodyStyle={bodyStyle} className='bodycd' >
          <Text>
            {Booktite[1]}
          </Text>
          <figure style={{ margin: 12 }} ref={secondCardRef} />
        </Card>
      </Flex>
    </Content>
  );
}




