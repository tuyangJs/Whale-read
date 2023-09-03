// 在主进程中.
const { Menu, app, } = require('electron')
app.on('window-all-closed', () => {
    app.quit()
})


app.whenReady().then(async () => {
    newMainwin()
})

//创建主窗口
function newMainwin() {
    const preload = __dirname + '/js/Mainwin.js'
    const MianWinObj = {
        width: 1126,
        height: 726,
        minWidth: 780,
        minHeight: 500,
        frame: true,
        titleBarStyle: 'hidden',
        backgroundColor: '#141414',
        show: false,
        titleBarOverlay: {
            height: 46,
            color: '#ffffff00',
            symbolColor: '#ffffff00',
        },
        //resizable:false,
        webPreferences: {
            session: 'persist:HiveMcCode',
            partition: 'persist:HiveMcCode',
            v8CacheOption: 'bypassHeatCheck',
            nodeIntegration: true,
            preload: preload,
            additionalArguments: [],
        }

    }
    /* 声明全局变量 */
    /* 判断是不是win11系统 */
    var BrowserWindow
    var IS_WINDOWS_11
    var os = require('os');
    var release = os.release(); // 获取系统版本号
    var platform = os.platform(); // 获取系统平台
    if (platform === 'win32' && release.startsWith('10.0.') && parseInt(release.split('.')[2]) >= 22000) {
        const { MicaBrowserWindow } = require('mica-electron');
        IS_WINDOWS_11 = true
        BrowserWindow = MicaBrowserWindow
       
    } else {
        const { BrowserWindow: BrowserWindows } = require('electron');
        BrowserWindow = BrowserWindows
        IS_WINDOWS_11 = false
    }
    console.log('Win11 this',IS_WINDOWS_11);
    Menu.setApplicationMenu(null)
    const win = new BrowserWindow(MianWinObj)
    /*  win.setAutoTheme() */
    if (IS_WINDOWS_11) {
        win.setAutoTheme()
    } else {

    }
    win.loadURL('http://localhost:8000')
    win.show()

    win.once('ready-to-show', async () => {
        await win.webContents.openDevTools()
    })
    const { nativeTheme } = require('electron')

    win.webContents.once('did-frame-finish-load', async e => {
        win.webContents.send('WinRady')

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
    /** 切换窗口的模式，夜间与背景透明效果
     * 
     * @param {*} err 是否为夜间模式
     * @param {*} maic 亚克力或者云母
     */
    function tabwinui(err, maic) {

        if (IS_WINDOWS_11) {
            if (err == 2) {
                win.setDarkTheme();
            }
            if (err == 1) {
                win.setLightTheme()

            }
            if (err == 3) {
                win.setAutoTheme()
            }
            if (maic == undefined || maic) {
                win.setMicaAcrylicEffect()
            } else {
                win.setMicaEffect()
            }
        } else {
            //Windows 10

        }


        if (nativeTheme.shouldUseDarkColors) {
            win.setTitleBarOverlay({
                color: '#ffffff00',
                symbolColor: '#fff',
            })
        } else {
            win.setTitleBarOverlay({
                color: '#ffffff00',
                symbolColor: '#000',
            })
        }
        console.log(err, maic);
    }

    ipcMain.on('winTheme', (e, err, maic) => {
        tabwinui(err, maic)
    })
    win.on('will-resize', (e, newBounds) => {
        win.webContents.send('Winresize', {
            target: {
                innerWidth: newBounds.width
            }
        })
    })
    win.hookWindowMessage(278, function (e) {
        win.setEnabled(false);//窗口禁用菜单
        setTimeout(() => {
            win.setEnabled(true);
        }, 100) //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
        return true
    })
    ipcMain.handle('appDataurl', async () => {
        appdata()
        return { url: app.getPath("appData"), userData: userData }
    })
    //获取主题
    ipcMain.handle('getOStheme', async () => {
        return nativeTheme.shouldUseDarkColors
    })
    function tabWinui() {
        win.webContents.send('onChange', nativeTheme.shouldUseDarkColors)
        if (nativeTheme.shouldUseDarkColors) {
            win.setTitleBarOverlay({
                color: '#ffffff00',
                symbolColor: '#fff',
            })
        } else {
            win.setTitleBarOverlay({
                color: '#ffffff00',
                symbolColor: '#000',
            })
        }
    }
    //系统主题更新事件
    nativeTheme.on('updated', (e) => {
        tabWinui()
    })

    //系统对话框
    const { dialog } = require('electron')
    ipcMain.handle('dialog', async (e, type, option) => {
        return dialog[type](win, option)
    })

}

//储存数据
var userData
appdata()
function appdata() {
    const fs = require('fs');
    let appDataurl = app.getPath("appData") + '\\codeUserData.json'
    fs.access(appDataurl, err => {
        console.log('文件存在', appDataurl, err);
        if (err) {
            fs.writeFile(appDataurl, '{"user":{}}', err => {
                console.log('创建文件', err);
                userData = { "user": {} }
            })
        } else {
            fs.readFile(appDataurl, (err, data) => {
                if (err) {
                    return;
                }
                userData = JSON.parse(data)
            })
        }
    })
}



