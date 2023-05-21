
const { app, BrowserWindow } = require('electron')

function createWindow () {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 1300,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,// 设置web安全性，设置为false表示关闭比如跨域限制就没了
        }
    })
    // 加载index.html文件
    win.loadFile('index.html')
    //win.loadURL('https://www.baidu.com')

    // Open the DevTools.
    //win.webContents.openDevTools()
}
app.on('ready', createWindow)