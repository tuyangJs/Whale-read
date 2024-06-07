import { useRef } from "react";
import { Scrollbar } from "smooth-scrollbar-react";

function Scroll(e: {
    scrollbarRef?: any;
    style?: React.CSSProperties | undefined;
    alwaysShowTracks?: boolean
    children: any
}) {
    const customStyle = {
        track: {
            background: '#ffffff00',
            width: '8px', // 设置滚动条轨道的宽度
            ' margin-right': '4px'
        },
        thumb: {
            background: '#1a1a1ab3',
            ' border-radius': '6px', // 设置滚动条滑块的边角
            width: '8px', // 设置滚动条滑块的宽度
        },
    };
    // @ts-ignore
    return (<Scrollbar
        style={e.style}
        ref={e?.scrollbarRef}
        plugins={{
            overscroll: {
                effect: "bounce",
                damping: 0.12,
                glowColor: 'rgb(22 22 22 / 75%)',
            } as const
        }}
        alwaysShowTracks={e?.alwaysShowTracks}
    >
        {e.children}
        <style>
            {`
          .scrollbar-track {
            ${Object.keys(customStyle.track).map(
                (key) => `${key}:${customStyle.track[key]};`
            ).join('')}
          }
          .scrollbar-thumb {
            ${Object.keys(customStyle.thumb).map(
                (key) => `${key}:${customStyle.thumb[key]};`
            ).join('')}
          }
        `}
        </style>
    </Scrollbar>)
}


export default Scroll