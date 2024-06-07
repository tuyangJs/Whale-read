import React from 'react';
import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';

const Notification: { NotApi: NotificationInstance,NotificationComponent:React.FC} = () => {
    const [api, contextHolder] = notification.useNotification();

    const NotificationComponent: React.FC = () => (
        <>
            {contextHolder}
        </>
    );

    return {
        NotificationComponent: NotificationComponent,
        NotApi: api
    };
};

export default Notification;
