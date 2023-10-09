import Modal from '@/pages/diydemo/Modal'
import { Button, Form, Input } from 'antd';
import React, { memo } from 'react';
import type { InputRef } from 'antd';
interface Props {
    open: Boolean,
    setOpen: any
    openMsg: any
    onCreate: () => void
}
type FieldType = {
    Gtoupname?: string;
};
type HelpType = {
    vdata?: "success" | "warning" | "error" | "validating" | undefined
    help?: string
};
const msgkey = 'newGazx7555'
const App: React.FC<Props> = ({ open, setOpen, openMsg, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const onFinishFailed = (errorInfo: any) => {
        console.log(errorInfo);
    }
    const [help, sethelp] = React.useState<HelpType>({ vdata: undefined, help: '' })
    const onFinish = (values: any) => {
        const { Gtoupname } = values
        if (TextValidation(Gtoupname)) {
            if (!loading) {
                openMsg(
                    {
                        key: msgkey,
                        type: 'loading',
                        content: '等待创建中...',
                        duration: 0,
                    }
                )
                setLoading(true)
                Hive.getGroup(Gtoupname, (result: string | any[]) => {
                    if (typeof result === 'string') {
                        openMsg(
                            {
                                key: msgkey,
                                type: 'error',
                                content: result,
                                duration: 4,
                            }
                        )
                    } else {
                        if (result.includes(Gtoupname)) {
                            openMsg(
                                {
                                    key: msgkey,
                                    type: 'success',
                                    content: '创建成功！',
                                    duration: 4,
                                }
                            )

                            setOpen(false)
                            form.resetFields(['Gtoupname'])
                            onCreate()
                        } else {
                            openMsg(
                                {
                                    key: msgkey,
                                    type: 'success',
                                    content: '创建失败！未知错误',
                                    duration: 4,
                                }
                            )
                        }
                    }
                    setLoading(false)
                })

            }
        } else {

        }

    };
    const TextValidation = (Text: string) => {
        const regex = /[\p{P}\p{N}]+/gu;
        if (Text) {
            const yt = regex.test(Text)
            if (yt) {
                sethelp({ vdata: 'error', help: '请不要使用符号' })
                return false
            } else {
                sethelp({ vdata: 'success', help: '' })
                return true
            }
        } else {
            sethelp({ vdata: undefined })
            return false
        }
    }
    const onChange = (values: any) => {
        const value = values.target.value
        TextValidation(value)

    }
    const inputRef = React.useRef<InputRef>(null);
    setTimeout(() => {
        try {
            inputRef.current!.focus({
                cursor: 'end',
            })
        } catch (error) {

        }

    }, 50);

    return <Modal
        open={open}
        width={410}
        maskClosable={true}
        title="创建书架分组"
        okText='创建'
        onCancel={() => { setOpen(false) }}
        footer={[
            <Button key="back" onClick={() => { setOpen(false) }}>
                取消
            </Button>,
            <Button
                key="ok"
                type="primary"
                loading={loading}
                onClick={() => {
                    form.submit()
                }}
            >
                创建
            </Button>,
        ]}
    >
        <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"

        >
            <Form.Item<FieldType>
                name="Gtoupname"
                label="创建一个新的书架分组，不可重名"
                validateStatus={help.vdata}
                help={help.help}
            >
                <Input
                    ref={inputRef}
                    id={help.vdata}
                    showCount={true}
                    maxLength={8}
                    onChange={onChange}
                    placeholder="请输入分组名，如：穿越" />
            </Form.Item>
        </Form>
    </Modal>
}

export default memo(App)