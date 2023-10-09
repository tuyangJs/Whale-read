import { ToolOutlined, BugOutlined, AntDesignOutlined, GithubOutlined, CompressOutlined, ExpandOutlined, ReloadOutlined } from "@ant-design/icons"
import { FloatButton, theme } from "antd"
interface Props {
    compactUi: boolean,
    setcompactUi: React.Dispatch<React.SetStateAction<boolean>>
    setcompact: (comui: any) => void
    isdev: boolean
}
const Body: React.FC<Props> = ({ compactUi, setcompactUi, setcompact, isdev }) => {
    return (
        <FloatButton.Group
            trigger="click"
            style={{ right: 20, bottom: 20 }}
            icon={<ToolOutlined />}
            tooltip={<div>快速设置</div>}
            key='ToolOutlined'
        >
            {isdev ? [
                <FloatButton
                    icon={<BugOutlined />}
                    key='devtools'
                    tooltip={<div>Open DevTools</div>}
                    onClick={() => Hive.opendevtools()}
                    type='primary'
                />,
                <FloatButton
                    icon={<AntDesignOutlined />}
                    tooltip={<div>Ant-Design文档</div>}
                    onClick={() => open('https://ant-design.gitee.io/components/overview-cn/')}
                    type='primary'
                    key='AntDesignOutlined'
                />,
                <FloatButton
                    icon={<GithubOutlined />}
                    tooltip={<div>Github主页</div>}
                    onClick={() => open('https://github.com/iyuli/MirrorCore_read')}
                    key='GithubOutlined'
                />
            ] : null}
            <FloatButton
                tooltip={<div>{!compactUi ? '紧凑界面' : '正常界面'}</div>}
                key='CompressOutlined'
                icon={!compactUi ? <CompressOutlined /> : <ExpandOutlined />}
                type={!compactUi ? 'default' : 'primary'}
                onClick={() => {
                    setcompactUi(!compactUi)
                    const comui = !compactUi ? theme.compactAlgorithm : null
                    setcompact(comui)
                }
                }
            />
            <FloatButton
                key='ReloadOutlined'
                icon={<ReloadOutlined />}
                tooltip={<div>重新渲染界面</div>}
                onClick={() => window.location.reload()}
            />
        </FloatButton.Group>
    )
}
export default Body