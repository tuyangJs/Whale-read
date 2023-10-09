// 在主进程中.
const radytime = process.uptime()
console.log(radytime, 'ms');
const { log } = require('console');
const { Menu, app, } = require('electron')
const fs = require('fs');
app.setAboutPanelOptions({
    applicationName: 'Whale Read',
    copyright: '版权所有 © 2023 荼泱 Email:ihanlong@qq.com'
})
app.setName('Whale_Read')
console.log(__dirname + '\\lod.html');
app.on('window-all-closed', () => {
    app.quit()
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
        // 输出从第二个实例中接收到的数据
        console.log(additionalData)

        // 有人试图运行第二个实例，我们应该关注我们的窗口

    })

}

const isdev = app.isPackaged //是否处于正式运行环境
Menu.setApplicationMenu(null) //去除默认菜单
app.whenReady().then(mainRday)
//初始化
async function mainRday() {
    const os = require('os');
    var release = os.release(); // 获取系统版本号
    var platform = os.platform(); // 获取系统平台
    console.log(release, platform);
    var BrowserWindow
    /* 声明全局变量 */
    IS_WINDOWS_11 = false

    if (platform === 'win32' && release.startsWith('10.0.') && parseInt(release.split('.')[2]) >= 22000) {
        const { MicaBrowserWindow, WIN10 } = require('mica-electron')
        Win10 = WIN10
        IS_WINDOWS_11 = true
        BrowserWindow = MicaBrowserWindow
    } else {
        const { BrowserWindow: BrowserWindows } = require('electron')
        BrowserWindow = BrowserWindows
        IS_WINDOWS_11 = false
    }

    const splashScreen = new BrowserWindow({
        width: 520,
        height: 360,
        frame: false,
        alwaysOnTop: true,
        titleBarStyle: 'hidden',
        resizable: false,
        title: '鲸阅阅读 载入中......',
        show: false,
        icon: __dirname + '/logo.ico',
        webPreferences: {
            session: 'persist:HiveMcCode',
            partition: 'persist:HiveMcCode',
            v8CacheOption: 'bypassHeatCheck',
            devTools: !isdev,
            preload: __dirname + '\\lod.js',
        }
    });
    if (IS_WINDOWS_11) {
        splashScreen.setMicaAcrylicEffect()
        splashScreen.setAutoTheme();
    }
    splashScreen.loadFile(__dirname + '\\lod.html')
    splashScreen.show()
    await appdata(() => {
        newMainwin(splashScreen, BrowserWindow)
    })
}
//创建主窗口
function newMainwin(splashScreen, BrowserWindow) {
    const preload = __dirname + '/Mainwin.js'
    const MianWinObj = {
        width: 1120,
        height: 720,
        minWidth: 546,
        minHeight: 500,
        title: '鲸阅言文',
        frame: true,
        titleBarStyle: 'hidden',
        alwaysOnTop: true,
        icon: __dirname + '/logo.ico',
        show: false,
        titleBarOverlay: {
            height: 45,/* 
            color: '#ffffff00',
            symbolColor: '#ffffff00', */
        },
        //resizable:false,
        webPreferences: {
            session: 'persist:HiveMcCode',
            partition: 'persist:HiveMcCode',
            v8CacheOption: 'bypassHeatCheck',
            devTools: !isdev,
            nodeIntegration: true,
            preload: preload,
            additionalArguments: [],
        }

    }
    MianWinObj.webPreferences.additionalArguments.push(IS_WINDOWS_11 ? 'os=Win11' : 'os=Win10') //告诉前端页面系统是否为win11
    MianWinObj.webPreferences.additionalArguments.push(isdev ? '' : 'isdev') //告诉前端页面当前是否为正式运行环境
    const win = new BrowserWindow(MianWinObj)//创建窗口
    /*  win.setAutoTheme() */
    if (IS_WINDOWS_11) {
        win.setAutoTheme() //设置自动主题
        console.log(userData)
        let ifoMiac = userData?.user?.backdrop
        ifoMiac = (ifoMiac === undefined) ? true : ifoMiac
        if (ifoMiac) {
            win.setMicaAcrylicEffect()
        } else {
            win.setMicaEffect()
        }
    }

    const contents = win.webContents
    const Mainurl = 'http://localhost:8000'
    splashScreen.send('ready', '正在渲染页面')
    contents.on('did-fail-load', (e) => { //导航页面失败
        try {
            splashScreen.send('ready', '等待项目启动')
        } catch (error) {

        }
        setTimeout(() => {
            win.loadURL(Mainurl)
        }, 500)
    })
    win.webContents.openDevTools()
    contents.on('did-stop-loading', (e) => { //导航成功事件
        //console.log(e);
        try {
            splashScreen.show()
            splashScreen.send('ready')
            setTimeout(function () { return splashScreen.destroy(); }, 1000);
            win.show()
        } catch (error) {

        }
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'dark'
            win.setTitleBarOverlay({
                color: '#ffffff00',
                symbolColor: '#fff',
            })
        } else {
            nativeTheme.themeSource = 'light'
            win.setTitleBarOverlay({
                color: '#ffffff00',
                symbolColor: '#000',
            })
        }
    })

    win.loadURL(Mainurl)
    /*   win.once('ready-to-show', async () => { //页面准备就绪
         
      }) */
    const { nativeTheme } = require('electron')
    win.once('focus', () => { //首次激活窗口,取消窗口置顶
        win.setAlwaysOnTop(false)
    })
    win.webContents.once('did-frame-finish-load', async e => {
        //win.webContents.send('WinRady')

    })
    const { session, ipcMain } = require('electron')
    const ses = session.fromPartition('persist:HiveMcCode', {
        cache: true
    })
    ses.clearStorageData({
        origin: 'http://192.168.3.22:8000',
        storages: ['localStorage'],
        quotas: 'syncable'
    })

    ipcMain.on('OpenDevTools', (e, err, maic) => { //打开控制台
        win.webContents.openDevTools()
    })
    ipcMain.on('winTheme', (e, err) => { //更新窗口主题事件
        tabwinui(err)
    })
    win.on('will-resize', (e, newBounds) => {
        win.webContents.send('Winresize', {
            target: {
                innerWidth: newBounds.width
            }
        })
    })
    win.webContents.on('page-title-updated', (e, title) => { //站点标题更新事件
        if (typeof title === 'string' && title && title != 'undefined') {
            win.setTitle(title + ' - 鲸阅言文')
            win.webContents.send('ontitle', title)
        }
    })

    ipcMain.handle('appDataurl', async () => {
        return { url: app.getPath("userData"), userData: userData }
    }) //获取主数据
    ipcMain.handle('bookDataurl', async () => {
        return { url: userData?.user?.BookFile, userData: bookData }
    }) //获取书库数据
    //获取主题
    ipcMain.handle('getOStheme', async () => {
        return nativeTheme.shouldUseDarkColors
    })

    //系统对话框
    const { dialog } = require('electron')
    ipcMain.handle('dialog', async (e, type, option) => {
        return dialog[type](win, option)
    })
    //创建上下文菜单窗口
    const Menuwin = ContextMenu(BrowserWindow)
    var menuboy = [
        { tite: '撤销', type: 'Undo' },
        { tite: '恢复', type: 'Redo' },
        { tite: '-' },
        { tite: '剪切', type: 'Cut' },
        { tite: '复制', type: 'Copy' },
        { tite: '粘贴', type: 'Paste' },
        { tite: '删除', type: 'Delete' },
        { tite: '-' },
        { tite: '全选', type: 'SelectAll' }
    ]
    function tabWinui() { //更新窗口控制按钮深浅色，这部分由主进程自动进行，无需前端页面参与。
        win.webContents.send('onChange', nativeTheme.shouldUseDarkColors)
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'dark'
            Menuwin.setBorderColor('#2b2b2b')
            win.setTitleBarOverlay({
                symbolColor: '#fff',
            })
        } else {
            nativeTheme.themeSource = 'light'
            Menuwin.setBorderColor('#efefef')
            win.setTitleBarOverlay({
                symbolColor: '#000',
            })
        }
    }

    nativeTheme.on('updated', (e) => { //窗口主题更新事件
        tabWinui()
    })
    win.webContents.on('context-menu', (e, params) => { //用户内容区鼠标右键处理
        var menuboys = menuboy
        if (params.isEditable) {
            for (let i = 0; i < menuboys.length; i++) {
                menuboys[i]['Disable'] = !params.editFlags['can' + menuboys[i].type]
            }
        } else {
            //console.log(params.isEditable);
            if (params.mediaType === 'image') {
                menuboys = [
                    { tite: '保存图像', type: 'saveImg', data: params.srcURL },
                    { tite: '复制图像', type: 'copyImg', data: [params.x, params.y] },
                ]
            } else {
                return
            }
        }

        const mainW = win.getBounds()
        const wX = params.x + mainW.x
        const wY = params.y + mainW.y + 10
        Menuwin.setBounds({ x: wX, y: wY })
        Menuwin.webContents.send('show', menuboys)
        if (!Menuwin.isVisible()) {
            Menuwin.showInactive()
        }
        Menuwin.moveTop()
    })
    //隐藏鼠标右键菜单
    ipcMain.on('Menu-Hide', async () => {
        Menuwin.hide()
    })
    //鼠标右键回调
    ipcMain.on('Menu-Even', (e, type, data, key) => {
        win.show()
        switch (type) {
            case 'Appint':
                break;
            case 'copyImg':
                win.webContents.copyImageAt(data[0], data[1])
                break;
            case 'saveImg':
                win.webContents.downloadURL(data)
                break;
            case 'SelectAll':
                win.webContents.selectAll()
                break;
            default:
                try {
                    win.webContents[type.toLowerCase()]()
                } catch (error) {
                    win.webContents.send('callMenu' + key, type, data)
                }
                break;
        }

    })
    ipcMain.on('MenuOpen', (e, params, menudata, key) => { //渲染进程使用右键菜单
        const mainW = win.getBounds()
        const wX = params.x + mainW.x
        const wY = params.y + mainW.y + 10
        Menuwin.setBounds({ x: wX, y: wY })
        Menuwin.webContents.send('show', menudata, key)
        if (!Menuwin.isVisible()) {
            Menuwin.showInactive()
        }
        Menuwin.moveTop()
    })
    ipcMain.on('menu-size', (e, w, h) => {
        Menuwin.setBounds({ width: w, height: h })
    })
    win.on('focus', () => { //当窗口获得焦点时触发
        Menuwin.hide()
    })
    win.on('blur', () => { //当窗口失去焦点时触发
        if (Menuwin.isVisible()) {
            setTimeout(() => {
                Menuwin.hide()
            }, 100);
        }

    })
    const { screen } = require('electron')
    win.hookWindowMessage(278, function () {  //非客户区（标题栏区域）右键事件处理
        const menuboys = [{
            icon: '<svg viewBox="64 64 896 896" focusable="false" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path></svg>',
            tite: '关于',
            type: 'Appint'
        }]
        Menuwin.setBounds(screen.getCursorScreenPoint())
        Menuwin.webContents.send('show', menuboys)
        Menuwin.moveTop()
        Menuwin.showInactive()
        win.setEnabled(false);//窗口禁用菜单
        setTimeout(() => {
            win.setEnabled(true);
        }, 80) //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
        return true
    })
    /** 切换窗口的模式，夜间与背景透明效果
 * @param {*} err 是否为夜间模式
 * @param {*} maic 亚克力或者云母
 */
    function tabwinui(err) {
        if (IS_WINDOWS_11) {
            if (err == 2) {
                Menuwin.setDarkTheme()
                win.setDarkTheme()
                nativeTheme.themeSource = 'dark'
            }
            if (err == 1) {
                Menuwin.setLightTheme()
                win.setLightTheme()
                nativeTheme.themeSource = 'light'
            }
            if (err == 3) {
                win.setAutoTheme()
                Menuwin.setAutoTheme()
                setTimeout(() => {
                    win.setAutoTheme()
                }, 50)

            }
        }
    }
}
const exec = require('child_process').exec;
//新窗口事件处理
app.on("web-contents-created", (event, contents) => {
    contents.setWindowOpenHandler(data => {
        exec('start ' + data.url)
        console.log(data.url);
        return {
            action: 'deny'
        }
    })
})
//上下文菜单
function ContextMenu(BrowserWindow) {
    const win = new BrowserWindow({
        width: 520,
        height: 360,
        frame: false,
        titleBarStyle: 'hidden',
        resizable: false,
        offscreen: false,
        show: false,
        skipTaskbar: true,
        type: 'splash',
        webPreferences: {
            session: 'persist:HiveMcCode',
            partition: 'persist:HiveMcCode',
            v8CacheOption: 'bypassHeatCheck',
            devTools: !isdev,
            preload: __dirname + '\\menu.js',
        }
    })
    win.webContents.loadFile(__dirname + '\\menu.html')
    win.setAutoTheme();
    win.setMicaAcrylicEffect()
    return win
}

var userData
//储存数据
async function appdata(callback) {
    let appDataurl = app.getPath("userData") + '\\codeUserData.json'
    aotudata(appDataurl, (backdata) => {
        userData = backdata
        bookdata()
        callback()
    })
}
var bookData
//书库数据索引
async function bookdata() {
    let appDataurl = userData?.user?.BookFile + '/index.json'
    aotudata(appDataurl, (backdata) => {
        bookData = backdata
    })
}
//自动读取数据
async function aotudata(url, callback) {
    console.log(url)
    const fs = await require('fs');
    var aotuData
    fs.access(url, err => {
        if (err) {
            fs.writeFile(url, '{"user":{}}', err => {
                aotuData = { "user": {} }
                callback(aotuData)
            })
        } else {
            fs.readFile(url, (err, data) => {
                if (err) {
                    callback(err)
                    return;
                }
                aotuData = JSON.parse(data)
                callback(aotuData)
            })
        }
    })
}



