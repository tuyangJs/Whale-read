import { Card, ConfigProvider, Layout, Button, Row, Col, Typography } from 'antd';
import { LeftOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useOutletContext } from 'umi';
import PageSet from "./set"
import styles from "./idnex.less"
const { Title, Text, Paragraph } = Typography;
//阅读页面组件
const { Header, Content } = Layout;
export default function HomePage(props: any) {
  const layoutContext = useOutletContext()
  return (
    <ConfigProvider
      //theme={dackTheme}
    >
      <Layout style={{padding:8}}>
        <Header style={{height:52, padding: 0,}}>
          <div style={{ height: 44 }}>
            <Row justify="space-around" align="middle">
              <Col flex="1 1 auto" >
                <Row justify="space-around" align="middle">
                  <Col flex="0 0 36px" >
                    <Button shape="circle" icon={<LeftOutlined />} size='small'
                      onClick={() => {
                        history.back();
                      }}
                    />
                  </Col>
                  <Col flex="1 0 auto" >
                    <Row justify="space-around" align="middle">
                      <Col flex="0 0 auto" >
                        <Title level={5} style={{ margin: 0 }}>
                          冰河末世，我囤积了百亿物资
                        </Title>
                      </Col>
                      <Col flex="1 0 auto" >
                        <Title level={5} style={{ margin: 0 }}>
                          <UnorderedListOutlined style={{ margin: '0 2px 0 8px' }} />
                          第44章 凭什么让我施舍？
                        </Title>
                      </Col>
                    </Row>

                  </Col>
                </Row>
              </Col>
              <Col flex="auto">

              </Col>

            </Row>
            </div>
        </Header>
        <Content style={{ margin: '0 0 0 0', borderRadius: '12px 0 0 0' }}>
        <Row >
        <Col className={styles.bodycl} flex="auto">
          <Card className={styles.bodycd} >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col flex="5px"></Col>
        <Col className={styles.bodycl} flex="auto">
          <Card className={styles.bodycd} >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>
        </Content>
      </Layout>

</ConfigProvider >
  );
}




