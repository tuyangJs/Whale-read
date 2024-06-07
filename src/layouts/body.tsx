import React, { useEffect, useRef, useState } from 'react';
import { Outlet, history } from 'umi';
import Scroll from './function/Sbr';
//定义滚动条；平滑滚动
interface Props {
    context: any,
}

const Body: React.FC<Props> = ({ context }) => {
    const [padding, setpadding] = useState<string | number>('16px 16px 0 16px')
    const scrollbarRef = useRef<any>(null);
    useEffect(() => {
        nrwep(history.location)
        history.listen(async (e) => { //路由更新事件
            if (scrollbarRef.current) {
                scrollbarRef.current.scrollTop(0, 0); // 将滚动位置设置为顶部
            }
            await nrwep(e.location)
        })
    }, [padding])

    const nrwep = (e: any) => {
        if (e.pathname === '/read') { //进入阅读页面，铺平页面
            setpadding(0)
        } else {
            if (padding === 0) setpadding('16px 16px 0 16px')
        }
    }
    return (
        <Scroll scrollbarRef={scrollbarRef}>
            <div style={{ height: "calc(100vh - 48px)", padding: padding }}>
                <Outlet context={context} key='outlet' />
            </div>
        </Scroll>
    )

}
export default Body;