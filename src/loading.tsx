import React from 'react';
import { Spin } from 'antd';
if (typeof Hive === 'undefined') {
  alert('非法的访问！')
     throw new Error("非法的访问！请在程序内访问！")
}
const App: React.FC = () => (
  <div className="example">
    <Spin />
    加载中
  </div>
);

export default App;