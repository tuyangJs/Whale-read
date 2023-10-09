import { Tree, Statistic, Button } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React ,{memo}from 'react';


interface Props {
    gupData: DataNode[],
    setgupData: React.Dispatch<DataNode[]>,
    openMsg: any
}
const App: React.FC<Props> = ({ openMsg, gupData, setgupData }) => {
    const setGupData = setgupData
    const onDrop: TreeProps['onDrop'] = (info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (
            data: DataNode[],
            key: React.Key,
            callback: (node: DataNode, i: number, data: DataNode[]) => void,
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children!, key, callback);
                }
            }
        };
        const data = [...gupData];

        // Find dragObject
        let dragObj: DataNode;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (
            ((info.node as any).props.children || []).length > 0 && // Has children
            (info.node as any).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                item.children.unshift(dragObj);
                // in previous version, we use item.children.push(dragObj) to insert the
                // item to the tail of the children
            });
        } else {
            let ar: DataNode[] = [];
            let i: number;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i!, 0, dragObj!);
            } else {
                ar.splice(i! + 1, 0, dragObj!);
            }
        }
        setGupData(data);

    };

    const Menucolik = function (params: any) {  //分组管理 右键处理
        const { clientX, clientY } = params.event

        const { key, title } = params.node
        const position: object = {
            x: clientX,
            y: clientY
        }
        const calldata = [key, title]
        const menuc: object = [
            {
                icon: '<svg viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>',
                tite: '删除',
                type: '_Delt',
                data: calldata
            }, {
                icon: '<svg viewBox="64 64 896 896" focusable="false" data-icon="form" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"></path><path d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"></path></svg>',
                tite: '重命名',
                type: '_Rename',
                data: calldata
            },
        ]
        //@ts-ignore 打开程序右键菜单
        Hive.MenuOpen(position, menuc, (type, data) => {
            if (type === '_Delt') {
                const Ndata = [...gupData]
                const Jdata = [...gupData]
                let Cancel = false
                const onCancel = () => {
                    Cancel = true
                    setGupData(Jdata)
                    openMsg({ key: msgKey, type: 'warning', content: data[1] + ' 已撤销' })
                }
                const msgKey = 'guasczx899q' + Date.now()
                let delkey: number = -1
                for (var i = 0; i < Ndata.length; i++) {
                    if (Ndata[i].title === data[1]) {
                        delkey = i
                        break;
                    }
                }
                if (delkey < 0) {
                    openMsg({ key: msgKey, type: 'error', content: data[1] + ' 删除失败' })
                    return
                }
                Ndata.splice(delkey, 1)
                setGupData(Ndata)
                openMsg(
                    {
                        key: msgKey,
                        type: 'success',
                        icon: null,
                        duration: 7,
                        content: <Countdown name={data[1]} msgKey={msgKey} onCancel={onCancel} />,
                    },
                    () => {
                        if (Cancel) return
                        Hive.delGroup(data[1])
                        openMsg({ key: msgKey, type: 'warning', content: data[1] + ' ，已无法恢复' })
                    }
                )

            }

        })
    }
    //转换书架分组数据
    function bookgup(data: DataNode[]) {
        const backData: DataNode[] = []
        data.map((key: any) => {
            backData.push(key.title);
        })
        return backData
    }
    const Countdown: React.FC<{ msgKey: string, name: string, onCancel: () => void }> = ({ msgKey, name, onCancel }) => {
        const { Countdown } = Statistic;
        return (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {`${name} 删除成功`}
                <Countdown title=''
                    format="s 秒"
                    valueStyle={{ fontSize: 14 }}
                    value={Date.now() + 6000} onFinish={() => {
                        console.log(1);

                        openMsg(msgKey)
                    }} />
                <Button onClick={() => {
                    onCancel()
                }} type="link" style={{ padding: 0 }}>取消</Button>
            </div>
        )
    }

    return (
        <Tree
            className="draggable-tree"
            draggable
            blockNode={true}
            defaultExpandParent
            onDrop={onDrop}
            treeData={gupData}
            onRightClick={Menucolik}
        >
        </Tree>
    );
};

export default memo(App);