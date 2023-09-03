const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs');
var appDataurl
var userData
let time = null
let timeTh = null
let autouims = null
const parameter = process.argv
contextBridge.exposeInMainWorld(
    'Hive',
    {
        onTheme: (eback) => {
            ipcRenderer.on('WinRady', () => {
                console.log(1);
                eback(true)
            })

        },
        winTheme: (err,maic) => {
            // console.log('主题切换',err);
            if (timeTh !== null) {
                setInterval(timeTh)
            }
            timeTh = setTimeout(
                ipcRenderer.send('winTheme', err,maic)
                , 50
            )

        },
        onWinresize: (eback) => {
            ipcRenderer.on('Winresize', (e, data) => {
                eback(data)
            })
        },
        filedata: (name, data) => {
            if (name == undefined) return
            if (data !== undefined) {
                userData.user[name] = data
                if (time !== null) {
                    setInterval(time)
                }
                time = setTimeout(
                    fs.writeFile(appDataurl, JSON.stringify(userData), err => {
                        // nedata()
                    })
                    , 50
                )
            }
         
            return userData.user[name]
        },
        onchange: (fion) => {
            let comgo = typeof fion !== 'function'
            if (comgo) return
            ipcRenderer.on('onChange', (e, data) => {

                comgo = (userData?.user?.ifoDack != 3) ? false : true
                if (!comgo) return
                console.log('B', data, autouims);
                if (autouims == null) setInterval(autouims)

                autouims = setTimeout(() => {
                    console.log('A', data);
                    fion(data)
                }, 80);

            })
        },
        change: () => {
            return ipcRenderer.invoke('getOStheme')
        },
        osdialog: (type, options) => {
            return ipcRenderer.invoke('dialog', type, options)
        },
        onContextmenu:(eback)=>{
            ipcRenderer.on('context-menu', (e, data) => {
                console.log(data);
                eback(data)
            })
        },
       Process:parameter,
    }
)
function nedata() {
    ipcRenderer.invoke('appDataurl').then((result) => {
        userData = result.userData
        appDataurl = result.url + '\\codeUserData.json'
    })
}
nedata()
