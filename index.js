
const { app, BrowserWindow, globalShortcut, ipcRenderer, ipcMain } = require('electron')
const path = require('path');

console.log(path.join(__dirname,"src/preload.js"))

function createWindow () {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 1300,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,// 设置web安全性，设置为false表示关闭比如跨域限制就没了
            /**
             * 该脚本可以在页面的其他脚本执行前执行。脚本可以使用nodejs的api。可以使用require()引入模块使用
             */
            preload: path.join(__dirname,"src/preload.js")
        }
    })
    // 加载index.html文件
    win.loadFile('index.html')
    //win.loadURL('https://www.baidu.com')

    // Open the DevTools.
    //win.webContents.openDevTools()
}

function ready(){
    // ipcMain 仅在主进程中可用。渲染进程可以通过 ipcRenderer.send() 来向这个事件监听器发送消息
    ipcMain.on('asynchronous-message', function(event, arg) {
        console.log('主进程侦听事件', arg);

        // 给子进程发送消息。子进程可以通过 ipcRenderer.on() 来绑定监听
        event.sender.send('renderer_event_listen_1', 'pong');
    });

    // 快捷键定义,这个是全局的，不管你在什么软件按这个快捷键都会触发
    globalShortcut.register('CommandOrControl+F', () => {
        console.log("主进程快捷键监听")
    });

    // 创建页面窗口
    createWindow();
}
app.on('ready', ready)