import QueueAnim, { IProps } from "rc-queue-anim";
import React, { } from "react";
import { SizeType } from "antd/es/config-provider/SizeContext";
interface CustomFlexProps {
    Flexpos?: {
        vertical?: boolean;
        wrap?: React.CSSProperties['flexWrap'];
        justify?: React.CSSProperties['justifyContent'];
        align?: React.CSSProperties['alignItems'];
        flex?: React.CSSProperties['flex'];
        gap?: SizeType | React.CSSProperties['gap'];
    } | undefined;
    IProps?: IProps
    children: React.ReactNode;
}

const Flexs: React.FC<CustomFlexProps> = (props) => {
    const { children, IProps, Flexpos } = props;
    if (!children) return null;
    return (
        <QueueAnim {...IProps}
            style={{
                display: 'flex',
                flexDirection: Flexpos?.vertical ? 'column' : 'row',
                gap: Flexpos?.gap,
                flexWrap: Flexpos?.wrap,
                flex: Flexpos?.flex,
                alignItems: Flexpos?.align,
                justifyContent: Flexpos?.justify
            }}>
            {children}
        </QueueAnim>
    );
}

export { Flexs, CustomFlexProps };
