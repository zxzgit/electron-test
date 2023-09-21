
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

/**
 * This method will be called when Electron has
 * finished initialization and is ready to create
 * browser windows. Some APIs can only be used
 * after this event occurs. This method is
 * equivalent to 'app.on('ready', function())'
 */
//app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    console.log('退出程序')
    app.quit()
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the
    // app when the dock icon is clicked and there are no
    // other windows open. 当没有任何窗口在的时候触发建立新窗口
    if (BrowserWindow.getAllWindows().length === 0) {
        console.log('没有窗口')
        createWindow()
    }
})

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

        // 获取当前窗口
        let win = BrowserWindow.getFocusedWindow()
        // 高亮搜索到的内容，由于这个快捷点是操作系统全局的，要判断是否获取得到win
        if(win){
            let findResult = win.webContents.findInPage("soa")
            console.log('搜索结果第几个匹配结果（索引从1开始）', findResult)

            // found-in-page 会多次设置，这里 win.isSet 标记只设置一次
            !win.isSet && win.webContents.on('found-in-page', (event, search_result) => {
                // activeMatchOrdinal： 当前匹配；matches：总匹配个数
                console.log(search_result.requestId, search_result.activeMatchOrdinal, search_result.matches, search_result.selectionArea);
            });
            win.isSet = true;
        }
    });

    globalShortcut.register('CommandOrControl+F+H',  () => {
        // 清除搜索
        let win = BrowserWindow.getFocusedWindow()
        win && win.webContents.stopFindInPage('clearSelection');
    });

    // 创建页面窗口
    createWindow();
}
app.on('ready', ready)