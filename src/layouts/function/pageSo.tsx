const data = [
    {
        path: "/",
        component: "index",
        name: '书架'
    },
    {
        path: "/soso",
        component: "soso",
        name: '在线搜索'
    },
    {
        path: "/app",
        component: "app",
        name: '扩展',
        text: [
            { name: "安装扩展" }
        ]
    },
    {
        path: "/setweb",
        component: "setweb",
        name: '个性化',
        text: [
            { name: '主题颜色', doc: '设置后可在本页面预览，鼠标放在可互动组件查看效果' },
            { name: '程序主题', doc: '浅色、深色、自动' },
            { name: '背景效果', doc: '亚克力采样窗口后的背景，云母采样桌面壁纸，节省资源占用' },
            { name: '程序字体', doc: '字体预览' },
            { name: '书架' },
            { name: '书库位置', doc: '更改位置' },
            { name: '书架分组' },
        ]
    },
    { path: '/read', component: "read", text: 'read' },
]
function searchInData(query: string) {
    const results: any = [];
    // 遍历数据数组
    data.forEach((page) => {
        const { name, path, text} = page;

        // 检查页面名是否匹配
        if (name && name.includes(query)) {
            results.push({ name, path, textIndex: null });
        }

        // 检查text字段中的名称和doc是否匹配
        if (Array.isArray(text)) {
            text.forEach((item) => {
                if (item.name.includes(query) || (item.doc && item.doc.includes(query))) {
                    results.push({ name,fname:item.name, doc: item.doc, path, });
                }
            });
        }
    });
    return results;
}
export default searchInData

