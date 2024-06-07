
import { useOutletContext } from '@/.umi/exports';
import { SyncOutlined } from '@ant-design/icons';
import { Divider, Table, Typography } from 'antd';
import { Flexs } from '@/module/FlexsAnim'
import React, { useRef, useState } from 'react';
document.title = '关于'
const { Title, Text } = Typography;

const { chrome, electron } = Hive.Process.versions

const dataSource = [
    {
        key: '1',
        technology: 'WebView',
        icon: (<img src="data:image/png;base64,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"
            alt="Chromium" width="36px" height="36px" />),
        name: 'Chromium',
        age: chrome,
    },
    {
        key: '2',
        technology: '客户端框架',
        icon: (<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="36px" height="36px" />),
        name: 'Electron',
        age: electron,
    },
    {
        key: '3',
        technology: '编程语言',
        icon: (<img alt="TypeScript" width="36px" height="36px" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElD
        ICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NW
        Ry8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjk4OTM0ODczNzE1IiBjbGFzcz0iaWNvbiIg
        dmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53
        My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzOTkiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2Vh
        cmNoX2luZGV4LjAuaTAuMmE1NTNhODFOSkhQdnQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3Lncz
        Lm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZD0iTTEwLjI0
        IDQ1OC43NTJsMjg1LjY5Ni0zMDAuMDMydjE1Mi41NzZsLTE5NC41NiAxOTYuNjA4djIuMDQ4bDE5
        My41MzYgMTk3LjYzMnYxNTMuNkwxMC4yNCA1NjAuMTI4eiBtNzE3LjgyNCAyNDkuODU2TDkyMS42
        IDUxMnYtMi4wNDhMNzI4LjA2NCAzMTMuMzQ0VjE2MC43NjhMMTAxMy43NiA0NjAuOHYxMDUuNDcy
        TDcyOC4wNjQgODY2LjMwNHoiIGZpbGw9IiMwMDkwRTAiIHAtaWQ9IjI0MDAiIGRhdGEtc3BtLWFu
        Y2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTMuMmE1NTNhODFOSkhQdnQiPjwvcGF0aD48
        cGF0aCBkPSJNMzkwLjE0NCA0NDEuMzQ0aC04MC44OTZ2LTM4LjkxMmgyMDcuODcydjM4LjkxMmgt
        ODEuOTJ2MjA4Ljg5NmgtNDUuMDU2VjQ0MS4zNDR6IG0xODIuMjcyIDE0NS40MDhzMjYuNjI0IDI2
        LjYyNCA2MS40NCAyNi42MjRjMTguNDMyIDAgMzUuODQtMTAuMjQgMzUuODQtMjkuNjk2IDAtNDQu
        MDMyLTExNi43MzYtMzYuODY0LTExNi43MzYtMTEyLjY0IDAtNDAuOTYgMzUuODQtNzEuNjggODIu
        OTQ0LTcxLjY4IDQ5LjE1MiAwIDczLjcyOCAyNi42MjQgNzMuNzI4IDI2LjYyNGwtMTkuNDU2IDM2
        Ljg2NHMtMjMuNTUyLTIxLjUwNC01NC4yNzItMjEuNTA0Yy0yMS41MDQgMC0zNi44NjQgMTIuMjg4
        LTM2Ljg2NCAyOS42OTYgMCA0NC4wMzIgMTE2LjczNiAzMi43NjggMTE2LjczNiAxMTEuNjE2IDAg
        MzkuOTM2LTI5LjY5NiA3Mi43MDQtODEuOTIgNzIuNzA0LTU1LjI5NiAwLTg0Ljk5Mi0zMy43OTIt
        ODQuOTkyLTMzLjc5MmwyMy41NTItMzQuODE2eiIgZmlsbD0iIzAwOTBFMCIgcC1pZD0iMjQwMSI+
        PC9wYXRoPjwvc3ZnPg==" />),
        name: 'TypeScript',
        age: '-',
    },
    {
        key: '4',
        technology: '前端框架',
        icon: (<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElD
ICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NW
Ry8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjk5MDIyMDE1NTczIiBjbGFzcz0iaWNvbiIg
dmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53
My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzNjgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9y
Zy8xOTk5L3hsaW5rIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZD0iTTYwMS40MDYg
NTA5LjY1MmMwLTcwLjA4OC03NS44OTItMTE0LjEzLTEzNi4yOC03OS4wODYtNjAuMzg0IDM1LjA0
Mi02MC4zODQgMTIzLjEyOCAwIDE1OC4xNzIgNjAuMzg4IDM1LjA0MiAxMzYuMjgtOSAxMzYuMjgt
NzkuMDg2eiBtMjA4LjAyLTE2OC4zNGM2MC4xMi0yODcuMzgtNzIuMTQ2LTM3Ny41NjQtMjk3LTE2
OS41NDQtMjExLjYyOC0xOTguNC0zNjIuMzMyLTEzNS44NzQtMjk4LjIwNCAxNjguMzQtMjk1Ljcy
IDg5LjE1Mi0yNzYuMTI4IDI1Ni45NzIgMi40MDYgMzQyLjY5NC02My43MjggMjgwLjE2NiA1NS4z
MTIgMzgyLjM3MiAyOTUuNzk4IDE3MC43NDRDNzQ1LjY5NiAxMDYyLjc2OCA4NjkuNSA5NjQuODEg
ODA1LjgxOCA2ODEuNmMzMDMuODE0LTEwMy4wMDggMjc2LjU2LTI1Mi4xMDggMy42MDgtMzQwLjI4
NnogbS00MC44ODItMTAuODIyYy00Ny42NjItMTAuNzUyLTkzLjc4LTE4LjU3OC0xNDAuNjg2LTIy
Ljg0OC0yNC43MTItMzYuMTM0LTUzLjQ5Ni03Mi4yMy04Ni41NzQtMTA1LjgxMiAxODAuMjc2LTE3
Mi45MiAyODYuNTI2LTExOC44OSAyMjcuMjYgMTI4LjY2ek0zMDMuMjA0IDU2NC45NmMxNy44MzQg
MzguMDc4IDQxLjI4MiA3Mi45NDggNTguOTE4IDEwMi4yMDgtMjguNzE4LTIuOTM4LTU5LjY1NC03
LjM5OC05Mi41ODgtMTMuMjI4IDEwLjU1NC0yOS41MzggMjEuNzg4LTU5LjIgMzMuNjY4LTg4Ljk4
eiBtLTIuNDA2LTEwMy40MDhjLTEzLjEyLTMxLjQ5Mi0yNS4wOS02MS44ODYtMzQuODctOTAuMTgy
IDMzLjk5Ni03LjA0OCA2Ny4zMTItMTMuNDQ2IDk2LjE5NC0xNS42MzItMjEuNDk2IDMzLjc2OC00
MS45MTQgNjkuMDc0LTYxLjMyNCAxMDUuODE0eiBtMjUuMjUgNTIuOTA2YzI5LjQwNC01OC44ODYg
NjAuNTA4LTExNC43ODIgOTQuOTkyLTE2NC43MzIgNjEuMTg4LTMuNTIgMTIxLjcyNi0zLjIwOCAx
ODEuNTY4IDEuMjAyIDMzLjU2MiA0Ni43NjYgNjQuODg2IDEwMi42NiA5NC45OTIgMTYzLjUzLTIy
LjUyOCA0Ni41NTYtNTQuNTE4IDEwMC4yMDgtOTEuMzg0IDE1Ny41Mi02MS41NTYgNC42Ni0xMjQu
NjcyIDQuMDE2LTE4OC43ODIgMC0zMi40OTQtNDkuNzgtNjMuMDEtMTAyLjIxNC05MS4zODYtMTU3
LjUyeiBtMzk0LjM5OCA1MC41MDJjMTEuNjc2IDI4LjMzNCAyMi40NjYgNTcuMjEyIDMyLjQ2NiA4
Ni41NzZhOTA4Ljk1OCA5MDguOTU4IDAgMCAxLTkxLjM4NiAxNC40M2MyMC41OS0zMS45IDQwLjEy
LTY1Ljc3IDU4LjkyLTEwMS4wMDZ6IG0tNTguOTItMjA5LjIyYzMyLjc4NiA0LjQ4NiA2NC40NTgg
MTAuMDkgOTQuOTkyIDE2LjgzMmE5NjcuMzY2IDk2Ny4zNjYgMCAwIDEtMzQuODcgODguOThjLTE4
LjYxMi0zNi43MDgtMzguNTk0LTcyLjAzOC02MC4xMi0xMDUuODE0eiBtLTkyLjU4Ni01Mi45MDhj
LTM3LjQ1LTEuNDctNzUuNTQ2LTEuNDIyLTExNC4yMzIgMCAxNi45MzYtMjIuMjc0IDM1LjgxMi00
NS41NCA1Ni41MTYtNjkuNzQgMjAuMTc0IDIxLjc3NiAzOS4yOSA0NS4yMTYgNTcuNzE2IDY5Ljc0
eiBtLTg2LjU3Ni0xMDEuMDA0Yy0zMy4wNzggMzMuNTgyLTYxLjg2IDY4LjQ3Ni04Ni41NzQgMTA0
LjYxLTQ2LjkwNiA0LjI3LTk0LjIyNiAxMi4wOTYtMTQxLjg4NiAyMi44NDYtNTYuNTE2LTI1MS4z
MDggNDguMTg2LTMwMC4zNzggMjI4LjQ2LTEyNy40NTZ6TTIyNy40NSA2NDMuMTJjLTI1MC41MDYt
NzUuMzUyLTIzOC40ODItMTkyLjc4OC0yLjQwNi0yNjIuMTI4IDE0LjQ0MiA0My44MiAzMS45MjQg
ODguMzI2IDUxLjcwNiAxMzEuMDY0LTE5LjIyIDQ0LjItMzYuMjM4IDg5LjU5NC00OS4zIDEzMS4w
NjR6IG0zMS4yNjIgNTAuNTAyYzQyLjQ4NiAxMC40MjIgODcuNTEgMTUuNDI0IDEzNC42NzQgMjAu
NDQyIDI4LjM3NiA0MC4wNDggNTcuNzY0IDc3LjI4IDg4Ljk4IDEwOS40Mi0xODMuNTcyIDE3NS45
NTYtMjg1LjkwNiAxMTIuMDI4LTIyMy42NTQtMTI5Ljg2eiBtMjUyLjUxMiA5OS44MDJjLTIxLjc1
NC0yMi41MjYtNDIuMDY0LTQ4LjA1LTYxLjMyNC03NS43NTIgNDIuOTM0IDAuOTA0IDg0LjQgMS4w
MDQgMTIzLjg1IDBhNjQzLjcxOCA2NDMuNzE4IDAgMCAxLTYyLjUyNiA3NS43NTJ6IG0zMC4wNiAz
MC4wNmMzMy40OTQtMzYuMzkgNjMuMDItNzMuMjggODguOTgtMTEwLjYyMiA0NC4zMDgtMy4yNiA4
OS4yLTEwLjA2OCAxMzQuNjcyLTIwLjQ0IDYyLjgxNiAyNTcuNDY2LTUxLjI0IDI5NS40ODQtMjIz
LjY1MiAxMzEuMDY0eiBtMjUzLjcxMi0xODIuNzY4Yy0xMi44OC00MS40Ny0yOS4xNDQtODQuNDYt
NDguMDk2LTEyOC42NmExMjIyLjA0IDEyMjIuMDQgMCAwIDAgNTAuNS0xMjkuODYyYzIzMC40Njgg
NjkuNzQgMjQ4LjkwNCAxODEuMTY2LTIuNDA0IDI1OC41MjJ6IiBmaWxsPSIjMjZBMkMxIiBwLWlk
PSIyMzY5Ij48L3BhdGg+PC9zdmc+"
            width="36px" height="36px"
            alt="React"
        />),
        name: 'React',
        age: '18.x',
    },
    {
        key: '5',
        technology: '界面框架',
        icon: (<img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="Ant Design" width="36px" height="36px" />),
        name: 'Ant Design',
        age: '5.10.x',
    },
];

const columns = [
    {
        title: '技术栈',
        dataIndex: 'technology',
        key: 'key',
    },
    {
        title: '图标',
        dataIndex: 'icon',
        key: 'key',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'key',
    },
    {
        title: '版本',
        dataIndex: 'age',
        key: 'key',
    },
];



const sider: React.FC = ({ }) => {
    const { openMsg } = useOutletContext();
    const [clickCount, setClickCount] = useState(0);
    const timerRef = useRef<null | NodeJS.Timeout>(null); // 初始化为 null 或计时器引用
    const handleMouseDown = () => {
        if (clickCount === 0) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // 设置一个计时器，1秒后重置点击次数
            timerRef.current = setTimeout(() => {
                setClickCount(0);
            }, 1000);
        }

        // 增加点击次数
        setClickCount((prevCount) => prevCount + 1);

        if (clickCount === 4) {
            // 当点击次数达到5时，执行特定操作
            let OpenDev = Hive.filedata('DevOpenMv')
            OpenDev = OpenDev ? false : true
            Hive.filedata('DevOpenMv', OpenDev)
            openMsg({
                type: 'warning',
                content: '开发者模式' + (OpenDev ? '打开' : '关闭')
            })
            if (timerRef.current) {
                clearTimeout(timerRef.current); // 清除计时器
            }
            setClickCount(0); // 重置点击次数
        }
    };

    return (
        <div>
            <Flexs Flexpos={
                {
                    vertical: true,
                    gap: '16px 8px',
                }}
                IProps={{
                    type: 'left',
                    delay: 260
                }}
            >
                <Title level={2} style={{ margin: 0 }} key='A1'>
                    芯阅言文
                </Title>
                <Text style={{ textIndent: '2em' }} key='A2'>
                    芯阅言文一款阅读兼写作的程序，并且可以安装插件或者开发插件个性化您的使用需求。
                </Text>
                <Text style={{ textIndent: '2em' }} key='A3'>
                    界面设计现代高端，用户操作动画丝滑。
                    支持用户自己编写插件扩展程序功能。
                </Text>
                <Text onClick={handleMouseDown} style={{ textIndent: '2em' }} key='A4' >
                    <SyncOutlined />    版本 0.1.6.1596
                </Text>
                <Divider key='B1' />
                <Title level={3} style={{ margin: 0 }} key='A5'>
                    程序技术栈
                </Title>
                <Table bordered pagination={false} columns={columns} dataSource={dataSource} key='A6' />
                <Divider key='B2' />
                <Title level={3} style={{ margin: 0 }} key='A8'>
                    开发人员
                </Title><Text style={{ textIndent: '2em' }} key='A9'>
                    荼泱
                </Text>
            </Flexs>


        </div>

    )
}
export default sider