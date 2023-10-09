import { Modal } from "antd"
import { ReactNode } from "react";

interface ModalProps {
    children?: ReactNode;
    width?: number;
    onCancel?: () => void;
    open: boolean;
    maskClosable?: boolean;
    footer?: React.ReactNode;
    afterClose?: () => void;
    okText?: string;
    onOk?: () => void;
    title?: string;
    closeIcon?: React.ReactNode;
    keyboard?: boolean;
}

const App = (props: ModalProps) => {
    const { width, onCancel, open, maskClosable, footer, afterClose, okText, onOk, title, closeIcon, keyboard } = props
    return (
        <Modal
            width={width}
            onCancel={onCancel}
            open={open}
            closeIcon={closeIcon}
            maskClosable={maskClosable}
            footer={footer}
            okText={okText}
            keyboard={keyboard}
            onOk={onOk}
            afterClose={afterClose}
            title={title}
            style={{ backdropFilter: 'saturate(180%) blur(30px)', borderRadius: 8, paddingBottom: '0px' }}>
            {props?.children}
        </Modal>
    )
}

export default App;
