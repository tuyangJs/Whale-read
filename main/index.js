// 在主进程中.
const radytime = process.uptime()
console.log(radytime, 'ms');
const { Menu, app, } = require('electron')
const fs = require('fs');
const { Script } = require('vm');
var lodurl = 'data:text/html;charset=UTF-8,'
console.log(__dirname + '\\lod.html');


app.on('window-all-closed', () => {
    app.quit()
})

fs.readFile(__dirname + '\\lod.html', 'utf8', function (codeInfo, dataStr) {
    lodurl += encodeURIComponent(dataStr)
    app.whenReady().then(async () => {
        const { BrowserWindow } = require('electron');
        const splashScreen = await new BrowserWindow({
            width: 520,
            height: 360,
            modal: true,
            //transparent: true,
            skipTaskbar: true,
            frame: false,
            autoHideMenuBar: true,
            alwaysOnTop: true,
            resizable: false,
            // movable: false,
            backgroundColor: '#222222'
        });
        await splashScreen.loadURL(lodurl)
        newMainwin(splashScreen)

        splashScreen.once('ready-to-show', async () => {
            console.log((process.uptime() - radytime), 'ms');
        })

    })
})


//创建主窗口
function newMainwin(splashScreen) {
    const isdev = app.isPackaged //是否处于正式运行环境
    const preload = __dirname + '/Mainwin.js'
    const MianWinObj = {
        width: 1126,
        height: 726,
        minWidth: 780,
        minHeight: 500,
        frame: true,
        titleBarStyle: 'hidden',
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
            devTools: !isdev,
            nodeIntegration: true,
            preload: preload,
            additionalArguments: [],
        }

    }
    /* 声明全局变量 */
    /* 判断是不是win11系统 */
    var BrowserWindow
    var IS_WINDOWS_11
    const os = require('os');
    var release = os.release(); // 获取系统版本号
    var platform = os.platform(); // 获取系统平台
    console.log(release, platform);
    if (platform === 'win32' && release.startsWith('10.0.') && parseInt(release.split('.')[2]) >= 22000) {
        const { MicaBrowserWindow } = require('mica-electron')
        IS_WINDOWS_11 = true
        BrowserWindow = MicaBrowserWindow
    } else {
        const { BrowserWindow: BrowserWindows } = require('electron')
        BrowserWindow = BrowserWindows
        IS_WINDOWS_11 = false
    }
    console.log('Win11 is', IS_WINDOWS_11);
    Menu.setApplicationMenu(null) //去除默认菜单
    MianWinObj.webPreferences.additionalArguments.push(IS_WINDOWS_11 ? 'os=Win11' : 'os=Win10') //告诉前端页面系统是否为win11
    MianWinObj.webPreferences.additionalArguments.push(isdev ? '' : 'isdev') //告诉前端页面当前是否为正式运行环境
    const win = new BrowserWindow(MianWinObj)//创建窗口
    /*  win.setAutoTheme() */
    if (IS_WINDOWS_11) {
        win.setAutoTheme() //设置自动主题
    } else {

    }
    const contents = win.webContents
    const Mainurl = 'http://localhost:8000'
    contents.on('did-fail-load', (e) => { //导航页面失败
        setTimeout(() => {
            win.loadURL(Mainurl)
        }, 1500)
    })
    win.loadURL(Mainurl)
    /*   win.once('ready-to-show', async () => { //页面准备就绪
         
      }) */
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
     * @param {*} err 是否为夜间模式
     * @param {*} maic 亚克力或者云母
     */
    function tabwinui(err, maic) {
        try {
            splashScreen.show()
            setTimeout(function () { return splashScreen.destroy(); }, 500);
            win.show()
        } catch (error) {

        }
        setTimeout(() => {
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
        }, 300)


    }
    ipcMain.on('OpenDevTools', (e, err, maic) => { //打开控制台
        win.webContents.openDevTools()
    })
    ipcMain.on('winTheme', (e, err, maic) => { //更新窗口主题事件
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
    function tabWinui() { //更新窗口控制按钮深浅色，这部分由主进程自动进行，无需前端页面参与。
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
//储存数据
var userData
appdata()
function appdata() {
    const fs = require('fs');
    let appDataurl = app.getPath("appData") + '\\codeUserData.json'
    fs.access(appDataurl, err => {
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



