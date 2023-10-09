const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs');
const path = require('path');
const request = require('request')
var appDataurl = null
var userData
let time = null
let timeTh = null
let bookurl = null
let title
let bookData = {}
const EPub = require("epub");
const parameter = process.argv
ipcRenderer.on('ontitle', (e, titles) => {
    title = titles
})
async function nedata() {
    ipcRenderer.invoke('appDataurl').then((result) => {
        appDataurl = result.url + '\\codeUserData.json'
        fs.readFile(appDataurl, (err, data) => {
            if (err) {
                return;
            }
            userData = JSON.parse(data)
        })
    })
    ipcRenderer.invoke('bookDataurl').then((result) => {
        bookData = result.userData
        bookurl = result.url
        let index_bookurl = bookurl + '/index.json'
        fs.readFile(index_bookurl, (err, data) => {
            if (err) {
                return;
            }
            bookData = JSON.parse(data)
            return
        })

    })
}
function debounce(func, delay) { //防抖函数
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

nedata()
let radyDom = {
    Process: parameter,
    filedata: (name, data) => {
        if (name === undefined) return
        if (data !== undefined) {
            userData.user[name] = data
            if (time !== null) {
                setInterval(time)
            }
            time = setTimeout(
                () => {
                    try {
                        fs.writeFile(appDataurl, JSON.stringify(userData), err => {
                            // nedata()
                        })
                    } catch (error) {
                        console.error(error);
                    }
                }, 50
            )
        }
        return userData.user[name]
    },
    onTheme: (eback) => {
        ipcRenderer.on('WinRady', () => {
            console.log(1);
            eback(true)
        })

    },
    winTheme: (err) => {
        // console.log('主题切换',err);
        if (timeTh !== null) {
            setInterval(timeTh)
        }
        timeTh = setTimeout(
            ipcRenderer.send('winTheme', err)
            , 50
        )

    },
    onWinresize: (eback) => {
        ipcRenderer.on('Winresize', (e, data) => {
            eback(data)
        })
    },

    change: () => {
        return ipcRenderer.invoke('getOStheme')
    },
    osdialog: (type, options) => {
        return ipcRenderer.invoke('dialog', type, options)
    },
    onContextmenu: (eback) => {
        ipcRenderer.on('context-menu', (e, data) => {
            console.log(data);
            eback(data)
        })
    },
    opendevtools: async () => {
        ipcRenderer.send('OpenDevTools')
    },
    MenuOpen: (position, data, callBack) => {
        const key = '_azxfdx' + Date.now()
        try {
            ipcRenderer.send('MenuOpen', position, data, key)
        } catch (error) {
            console.error(error, position, data)
        }
        ipcRenderer.on('callMenu' + key, (e, type, sdata,) => {
            callBack(type, sdata)
        })
    },
    moveBook: (src, dest, callback) => {
        fs.rename(src, dest, callback)
    },
    getGroup: function (...name) {
        group(...name)
    },
    delGroup: (name) => {
        const groupingl = bookData.user.grouping
        groupingl.splice(groupingl.indexOf(name), 1)
        bookData.user.grouping = groupingl
        let index_bookurl = bookurl + '/index.json'
        console.log(name);
        writeFile(index_bookurl, bookData, (err) => {
            console.log(err, index_bookurl);
        }, name)
    },
    Http: request,//HTTP模块
    ontitle: (callBack) => { //站点标题更新事件
        ipcRenderer.on('ontitle', (e, titles) => {
            callBack(titles)
        })
        callBack(title)
    },
    Mobilegroup: (target, bookname, current) => { //移动书籍到分组
        try {
            bookname = bookname.split('.').slice(0, -1).join('.');
            let index_bookurl = bookurl + '/index.json'
            let targetname = bookData.user?.grouping[target]
            if (bookData.user?.index == undefined) {
                bookData.user.index = {}
            }
            let targetIndex = bookData.user.index[targetname]

            if (!targetIndex) {
                targetIndex = []
            }
            targetIndex.push(bookname)
            if (typeof current === 'string') {
                const index = arr.indexOf(bookname);
                bookData.user?.index[current].splice(index, 1);
            }
            bookData.user.index[targetname] = targetIndex
            debounce(writeFile(index_bookurl, bookData, () => { }, bookname), 1000)

        } catch (error) {
            console.error(error);
        }

    },
    directorySelfTest: (url) => {
        try {
            fs.accessSync(url)
            return true
        } catch (error) {
            return false
        }

    },
    path: path,
    ImporBooks: (url, callBack) => {
        try {
            let bookUrl = bookurl + '\\Books'
            let destination = `${bookUrl}\\${path.basename(url)}`
            try {
                fs.accessSync(bookUrl)
            } catch (error) {
                fs.mkdirSync(bookUrl)
            } finally {
                fs.copyFile(url, destination, (err) => {
                    if (err) throw err;
                    callBack(err)
                });
            }
        } catch (error) {
            console.error(error);
        }

    }

}
function GetBooks() {//获取书籍
    
    let epub = new EPub(epubfile, imagewebroot, chapterwebroot);
}
contextBridge.exposeInMainWorld(
    'Hive',
    radyDom
)
const group = function (name, callback) {
    let index_bookurl = bookurl + '/index.json'
    if (typeof name === 'function') {
        name(bookData.user?.grouping)
        return
    }

    if (!bookurl) {
        callback((bookurl ? bookurl : '') + '书库路径不存在')
        return
    }

    fs.access(index_bookurl, err => {
        if (err) {
            callback(index_bookurl, '书库索引文件不存在！')
            return
        }
    })

    if (bookData.user?.grouping == null) {
        bookData.user = { grouping: [] }
    }
    let groupings = bookData.user.grouping
    if (groupings.includes(name)) {
        callback(name + ' 已存在')
        return
    }
    groupings.push(name)
    bookData.user.grouping = groupings

    debounce(writeFile(index_bookurl, bookData, callback, name), 100)

}
function writeFile(index_bookurl, bookData, callback, name) {
    fs.writeFile(index_bookurl, JSON.stringify(bookData), err => {
        if (err) {
            callback(name, '创建失败\n' + err)
            return
        } else {
            fs.readFile(index_bookurl, (err, data) => {
                if (err) {
                    callback(err)
                    return;
                }
                bookData = JSON.parse(data)
                callback(bookData.user.grouping)
                return
            })
        }
    })
}
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("body").onmousedown = function (e) {
        //  console.log('onmousedown',e);
        ipcRenderer.send('Menu-Hide')
    }
});

