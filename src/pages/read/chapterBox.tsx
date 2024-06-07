
import React, { useState } from 'react';
import { Badge, Button, List, Typography } from 'antd';
const { Text } = Typography;
type flow = {
  id: string;
  href: string;
  mediaType: string;
  title: string;
  order: number;
  level: number;
}
interface Props {
  data: flow[],
  style?: React.CSSProperties
  Chapter: number,
  onChange: (i: any) => void
}
const App: React.FC<Props> = ({ data, style, Chapter, onChange }) => {
  const [Chapters, setChapter] = useState<number>(Chapter); //章节
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      pagination={{ position: 'top', pageSize: 15, size: 'small', showSizeChanger: false, align: 'start' }}
      style={style}
      renderItem={(item, i) => (
        <List.Item key={i} style={{ padding: '8px 0' }}>
          <List.Item.Meta
            title={<>{(i === Chapters) ? <Badge style={{ margin: '0 6px' }} status='processing' dot /> : ''}
              <Button onClick={(e) => {
                setChapter(i);
                onChange(item)
              }} type="text">{item.title} </Button>
            </>}
          />
        </List.Item>
      )}
    />
  )
}

export default App;