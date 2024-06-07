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
const  { argv, versions } =process
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
let Bookepub = {}
nedata()
let radyDom = {
    Process: { argv, versions },
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
    soText: claaBack => {
        ipcRenderer.on('soText', (e, data) => {
            claaBack(data)
        })

    },
    change: () => {
        return ipcRenderer.invoke('getOStheme')
    },
    osdialog: (type, options) => {
        return ipcRenderer.invoke('dialog', type, options)
    },
    contents: (err, ...data) => {//浏览器对象
        return ipcRenderer.invoke('webContents', err, ...data)
    },
    Notification: (err, ...data) => {//创建OS(操作系统)桌面通知
        return ipcRenderer.invoke('osNotification', err, ...data)
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
    ImporBooks: (url, callBack) => { //导入书籍
        try {
            let bookUrl = bookurl + '\\Books'
            let destination = `${bookUrl}\\${path.basename(url)}`
            try {
                fs.accessSync(bookUrl)
            } catch (error) {
                fs.mkdirSync(bookUrl)
            } finally {
                GetBooks(url, epub => {
                    let UUID = epub?.metadata?.UUID
                    if (UUID) {
                        fs.copyFile(url, destination, (err) => {
                            if (err) throw err;
                            console.log(url, UUID);
                            callBack(UUID)
                        });
                    } else {
                        callBack(false)
                    }
                })
            }
        } catch (error) {
            console.error(error);
        }

    },
    LoadingBooks: LoadingBooks,//初始化书库书籍
    GetBooks: GetBooks,//获取书籍
    GetbookEpub: () => {
        return Bookepub
    },
    getBookimg: getBookimg,
    getBookSchedule: getBookSchedule,

}

async function LoadingBooks(callBack) {//初始化书库书籍
    try {
        const promises = [];
        await bookData.user?.grouping.forEach(text => {
            Bookepub[text] = {}
            bookData.user.index[text]?.forEach(bookname => {
                const promise = new Promise((resolve) => {
                    GetBooks(bookname, epub => {
                        if (typeof epub === 'string') {
                            Bookepub[text][bookname] = `【${bookname}】载入失败`;
                        } else {
                            Bookepub[text][bookname] = epub;
                        }

                        resolve();
                    });
                });
                promises.push(promise);
            });
        });

        // 使用 Promise.all 等待所有异步操作完成
        await Promise.all(promises);
        if (callBack) callBack();
    } catch (error) {
    } finally {

    }
}
LoadingBooks()
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
async function GetBooks(Bookfile, chapterId, callBack) {
    const writeFile = util.promisify(fs.writeFile);
    const epubFile = isFilePath(Bookfile) ? Bookfile : `${bookurl}/Books/${Bookfile}.epub`;
    const epubBook = await new EPub(epubFile, 'blob:', `${location.host}/read`);
    try {
        if (typeof chapterId === "function") {
            // 如果第三参数是一个回调函数
            callBack = chapterId;
            epubBook.on("end", async function () {
                // 缓存书籍数据
                const manifest = Object.values(epubBook.manifest);
                for (const fest of manifest) {
                    const bookdataf = `${bookurl}/Books/${epubBook.metadata.title}-${epubBook.metadata.UUID}/image`;
                    if (fest['media-type'] === 'image/jpeg') {
                        if (!isFilePath(bookdataf)) {
                            await mkdir(bookdataf, { recursive: true });
                            let imgf = `${bookdataf}/${fest.href}`;
                            const festID = fest.id
                            try {
                                if (!isFilePath(imgf) && fest.id) {
                                    await epubBook.getImage(festID, (error, img, mimeType) => {
                                        if (mimeType) {
                                            writeFile(imgf, img, err => {

                                            });
                                        }
                                    })

                                }
                            } catch (error) {
                                console.error(error);
                            }

                        }
                    }
                }
                callBack(epubBook);
            });
            epubBook.parse();
        } else if (typeof chapterId === "string") {
            // 如果第三参数是字符串，假设它是章节ID
            try {
                epubBook.on("end", function () {

                    epubBook.getChapter(chapterId, (err, chapterContent) => {
                        if (chapterContent) {
                            try {
                                callBack(chapterContent);
                            }
                            catch (error) {
                                console.error(error);
                            }
                        } else {
                            callBack(err);
                        }
                    });
                });
                epubBook.parse();
            } catch (error) {
                console.error(error);
            }

        }
    } catch (error) {
        callBack('载入失败:' + Bookfile);
        console.error(error, epubFile);
    }
}
function isFilePath(path) { //判断是否为存在路径文件
    try {
        const stats = fs.statSync(path);
        return stats.isFile();
    } catch (error) {
        return false;
    }
}
//获取书籍图像
function getBookimg(name, imgname) {
    const imgurls = `${bookurl}/Books/${name.trim()}/image/${imgname}`
    // 读取图像文件
    try {
        const data = fs.readFileSync(imgurls)
        // 将图像数据转换为Base64编码
        const base64Image = Buffer.from(data).toString('base64');
        // 在这里可以将base64Image发送给前端使用
        return (`data:image/jpeg;base64,${base64Image}`);
    } catch (error) {
        // console.error(error);
        return
    }
}
//保存和获取阅读进度
function getBookSchedule(dataurl, datas) {
    const dataFilePath = path.join(bookurl, 'Books', dataurl.trim(), 'data.json');
    let data = { Chapters: 0, NumberPss: 0 };
    try {
        // 读取数据文件
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        data = JSON.parse(rawData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // 文件不存在，创建文件并写默认数据
            fs.mkdir(path.join(bookurl, 'Books', dataurl.trim()), { recursive: true }, () => {
                fs.writeFile(dataFilePath, JSON.stringify(data), () => { });
            });
        } else {
            // 其他错误，可以根据需要进行处理
            console.error(error);
        }
    }
    // 更新数据
    const { Chapters, NumberPss } = datas ? datas : data
    if (typeof Chapters === 'number') {
        data.Chapters = Chapters;
    }
    if (typeof NumberPss === 'number') {
        data.NumberPss = NumberPss;
    }

    // 保存数据
    if (datas)   // 保存数据
        fs.writeFile(dataFilePath, JSON.stringify(data), () => { })

    return data;
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

