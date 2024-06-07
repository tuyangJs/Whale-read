import React, { ReactNode, forwardRef } from "react";
import { Card, Row, Col, Typography } from "antd";
const { Text } = Typography;
interface Props {
    Titles?: string | React.ReactNode;
    intro?: string | React.ReactNode;
    Pendant?: string | React.ReactNode;
    children?: ReactNode;
    key?: string;
    DIY?: boolean
}
const setCard: React.ForwardRefRenderFunction<HTMLDivElement, Props> = ({ Titles, intro, Pendant, children, key, DIY }, ref) => {
    const padding = DIY ? 0 : '8px 16px'
    return (
        <Card style={{ padding: padding, borderRadius: 8 }} key={key} ref={ref}>
            <Card.Grid style={{ padding: '8px 12px', width: '100%', boxShadow: 'none' }}>
                {DIY ? (children) : (
                    <Row justify="space-around" align="middle">
                        <Col flex={'auto'}>
                            {typeof Titles === 'string' ? (
                                <Text>
                                    {Titles}
                                </Text>
                            ) : (
                                Titles
                            )}
                            <br />
                            <Text type="secondary">
                                {intro}
                            </Text>
                        </Col>
                        <Col flex={'0 1 auto'}>
                            {Pendant}
                        </Col>
                        <Col flex={'0 1 auto'}>
                            {children}
                        </Col>
                    </Row>)}
            </Card.Grid>
        </Card>
    );
}
export default forwardRef(setCard);
