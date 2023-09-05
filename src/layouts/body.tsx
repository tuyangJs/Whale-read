import React from 'react';
import { Outlet } from 'umi';
import { Scrollbar } from 'smooth-scrollbar-react';
//定义滚动条；平滑滚动
const Sbr = function HomePage(e: any) {
    // @ts-ignore
    return (<Scrollbar plugins={{
        overscroll: {
            effect: "bounce"
        } as const
    }}
    > {e.children}</Scrollbar>
    )
}
interface Props {
    context: any,
}
const App: React.FC<Props> = ({ context }) => {
    return (

        <Sbr>
            <div style={{ height: "calc(100vh - 46px)", padding: '16px 16px 0 22px' }}>
                <Outlet context={context} />
            </div>
        </Sbr>
    )

}
export default App;