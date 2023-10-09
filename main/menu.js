const { ipcRenderer } = require('electron')
ipcRenderer.on('show', (e, data, keys) => {
    const APP = document.querySelector("#actmenu")
    APP.innerHTML = ''
    data.map((key) => {
        const divElement = document.createElement("div")//主结构
        divElement.setAttribute("class", "menuopt");
        if (key.Disable) {
            divElement.setAttribute("class", divElement.className + " disable");
        }else{
            divElement.addEventListener('mousemove',function(e){
                divElement.style.setProperty('--px', e.clientX - divElement.offsetLeft);
                divElement.style.setProperty('--py', e.clientY - divElement.offsetTop);
              });
        }
        if (key.tite === '-') {
            divElement.setAttribute("class", "menuhr-box")
            const menuhr = document.createElement("div")//标题
            menuhr.setAttribute("class", "menuhr")
            divElement.appendChild(menuhr)
        } else {
            const titeDIV = document.createElement("div")//标题
            titeDIV.setAttribute("class", "nopt")
            titeDIV.innerText = key.tite
            const icoDIV = document.createElement("div")//图标
            icoDIV.setAttribute("class", "spcont")
            icoDIV.innerHTML = '<div class="uicon prtclk ">' + key.icon ? key.icon : '' + ' </div>'

            const outico = document.createElement("div")//副标题
            outico.setAttribute("class", "uicon prtclk micon rightIcon")

            if (key.type) {
                if (!key.icon) {
                    icoDIV.innerHTML = '<div class="uicon prtclk ">' + (icons[key.type]?.icon) ? icons[key.type].icon : '' + ' </div>' //设置默认图标
                }
                try {
                    outico.innerText = icons[key.type].des ? icons[key.type].des : ''
                } catch (error) {

                }

            }
            divElement.appendChild(icoDIV)
            divElement.appendChild(titeDIV)
            divElement.appendChild(outico)
            divElement.addEventListener('click', () => {
                ipcRenderer.send('Menu-Even', key.type, key?.data, keys)
            })
        }
        APP.appendChild(divElement)
    })
    ipcRenderer.send('menu-size', APP.offsetWidth, APP.offsetHeight)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.querySelector("#actmenu").style.background = 'var(--bg2)'
        // 操作系统使用深色主题
        // 在这里添加相关代码，比如修改页面颜色等
    } else {
        document.querySelector("#actmenu").style.background = 'var(--bg1)'
        // 操作系统使用浅色主题
    }
})

document.addEventListener('visibilitychange', function () {
    const APP = document.querySelector("#actmenu")
    var isHidden = document.hidden;
    console.log(isHidden);
    if (isHidden) {
        APP.style.top = '-800px'
    } else {
        APP.style.top = '0px'
    }
})
const icons = {
    'Undo':
    {
        des: 'Ctrl + Z',
        icon: '<svg viewBox="64 64 896 896" focusable="false" data-icon="undo" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M511.4 124C290.5 124.3 112 303 112 523.9c0 128 60.2 242 153.8 315.2l-37.5 48c-4.1 5.3-.3 13 6.3 12.9l167-.8c5.2 0 9-4.9 7.7-9.9L369.8 727a8 8 0 00-14.1-3L315 776.1c-10.2-8-20-16.7-29.3-26a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-7.5 7.5-15.3 14.5-23.4 21.2a7.93 7.93 0 00-1.2 11.1l39.4 50.5c2.8 3.5 7.9 4.1 11.4 1.3C854.5 760.8 912 649.1 912 523.9c0-221.1-179.4-400.2-400.6-399.9z"></path></svg>',
    }
    ,
    'Redo':
    {
        des: 'Ctrl + Y',
        icon: '<svg viewBox="64 64 896 896" focusable="false" data-icon="redo" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"></path></svg>',
    }
    , 'Cut':
    {
        des: 'Ctrl + X',
        icon: '<svg viewBox="64 64 896 896" focusable="false" data-icon="scissor" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M567.1 512l318.5-319.3c5-5 1.5-13.7-5.6-13.7h-90.5c-2.1 0-4.2.8-5.6 2.3l-273.3 274-90.2-90.5c12.5-22.1 19.7-47.6 19.7-74.8 0-83.9-68.1-152-152-152s-152 68.1-152 152 68.1 152 152 152c27.7 0 53.6-7.4 75.9-20.3l90 90.3-90.1 90.3A151.04 151.04 0 00288 582c-83.9 0-152 68.1-152 152s68.1 152 152 152 152-68.1 152-152c0-27.2-7.2-52.7-19.7-74.8l90.2-90.5 273.3 274c1.5 1.5 3.5 2.3 5.6 2.3H880c7.1 0 10.7-8.6 5.6-13.7L567.1 512zM288 370c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm0 444c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>',
    },
    'Copy':
    {
        des: 'Ctrl + C',
        icon:
            '<svg viewBox="64 64 896 896" focusable="false" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg>',
    },
    'Paste':
    {
        des: 'Ctrl + V',
        icon:
            '<svg viewBox="64 64 896 896" focusable="false" data-icon="snippets" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M832 112H724V72c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v40H500V72c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v40H320c-17.7 0-32 14.3-32 32v120h-96c-17.7 0-32 14.3-32 32v632c0 17.7 14.3 32 32 32h512c17.7 0 32-14.3 32-32v-96h96c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM664 888H232V336h218v174c0 22.1 17.9 40 40 40h174v338zm0-402H514V336h.2L664 485.8v.2zm128 274h-56V456L544 264H360v-80h68v32c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-32h152v32c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-32h68v576z"></path></svg>',
    },
    'Delete':
    {
        des: 'Del',
        icon:
            '<svg viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>',
    },
    'SelectAll':
    {
        des: 'Ctrl + A',
        icon:
            '<svg viewBox="64 64 896 896" focusable="false" data-icon="font-colors" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zm-650.3-80h85c4.2 0 8-2.7 9.3-6.8l53.7-166h219.2l53.2 166c1.3 4 5 6.8 9.3 6.8h89.1c1.1 0 2.2-.2 3.2-.5a9.7 9.7 0 006-12.4L573.6 118.6a9.9 9.9 0 00-9.2-6.6H462.1c-4.2 0-7.9 2.6-9.2 6.6L244.5 723.1c-.4 1-.5 2.1-.5 3.2-.1 5.3 4.3 9.7 9.7 9.7zm255.9-516.1h4.1l83.8 263.8H424.9l84.7-263.8z"></path></svg>',
    },
    'saveImg':
    {
        icon:
            '<?xml version="1.0" encoding="UTF-8"?><svg  viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 24C44 22.8954 43.1046 22 42 22C40.8954 22 40 22.8954 40 24H44ZM24 8C25.1046 8 26 7.10457 26 6C26 4.89543 25.1046 4 24 4V8ZM39 40H9V44H39V40ZM8 39V9H4V39H8ZM40 24V39H44V24H40ZM9 8H24V4H9V8ZM9 40C8.44772 40 8 39.5523 8 39H4C4 41.7614 6.23857 44 9 44V40ZM39 44C41.7614 44 44 41.7614 44 39H40C40 39.5523 39.5523 40 39 40V44ZM8 9C8 8.44772 8.44771 8 9 8V4C6.23858 4 4 6.23857 4 9H8Z" fill="#333"/><path d="M6 35L16.6931 25.198C17.4389 24.5143 18.5779 24.4953 19.3461 25.1538L32 36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 31L32.7735 26.2265C33.4772 25.5228 34.5914 25.4436 35.3877 26.0408L42 31" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 13L37 18L42 13" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M37 6L37 18" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    'copyImg':
    {
        icon:
            '<?xml version="1.0" encoding="UTF-8"?><svg  viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 21C44 19.8954 43.1046 19 42 19C40.8954 19 40 19.8954 40 21H44ZM23 8C24.1046 8 25 7.10457 25 6C25 4.89543 24.1046 4 23 4V8ZM39 40H9V44H39V40ZM8 39V9H4V39H8ZM40 21V39H44V21H40ZM9 8H23V4H9V8ZM9 40C8.44772 40 8 39.5523 8 39H4C4 41.7614 6.23857 44 9 44V40ZM39 44C41.7614 44 44 41.7614 44 39H40C40 39.5523 39.5523 40 39 40V44ZM8 9C8 8.44772 8.44771 8 9 8V4C6.23858 4 4 6.23857 4 9H8Z" fill="#333"/><path d="M6 35L16.6931 25.198C17.4389 24.5143 18.5779 24.4953 19.3461 25.1538L32 36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 31L32.7735 26.2265C33.4772 25.5228 34.5914 25.4436 35.3877 26.0408L42 31" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33.3 6C31.4775 6 30 7.43473 30 9.20455C30 12.4091 33.9 15.3223 36 16C38.1 15.3223 42 12.4091 42 9.20455C42 7.43473 40.5225 6 38.7 6C37.5839 6 36.5972 6.53804 36 7.3616C35.4028 6.53804 34.4161 6 33.3 6Z" fill="#0593fa" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
}