const { ipcRenderer } = require('electron')
const errorText = '载入超时！右键本窗口可以关闭本程序。'
ipcRenderer.on('ready', (e, data) => {
    if (document.querySelector('.loader-text').innerText === errorText) return
    if (!data) {
        data = '载入完成'
        const App = document.querySelector("#wrapper > img")
        App.style.borderRadius = '0'
        App.style.animation = 'none'
        document.querySelector("#loader > div").style.display = 'none'
    }
    document.querySelector('.loader-text').innerText = data
})
setTimeout(() => {
    const App = document.querySelector("#wrapper > img")
    App.style.borderRadius = '0'
    App.style.animation = 'none'
    document.querySelector("#loader > div").style.display = 'none'
    document.querySelector('.loader-text').innerText = errorText
    document.querySelector('.loader-text').style.color = '#f32f00'
}, 2 * (60 * 1000))