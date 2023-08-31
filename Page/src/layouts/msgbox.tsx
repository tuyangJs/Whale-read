import React from 'react';
import { Button, notification, Space } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Props {
    type: NotificationType
    title: string;
    message: string;
    duration?:number
}

const Notifications: React.FC<Props> = ({ type, title, message,duration}) => {
    const [api, contextHolder] = notification.useNotification();
        api[type]({
            message: title,
            description:message,
        });

    return (
        <div>
            {contextHolder}
        </div>
    );
};

export default Notifications;