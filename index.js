
const { app, BrowserWindow, globalShortcut, ipcRenderer, ipcMain, Menu } = require('electron')
const path = require('path');

const isMac = process.platform === 'darwin'

console.log(path.join(__dirname,"preload.js"))

function createWindow () {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        //titleBarStyle: 'hiddenInset', // 设置无边框，解决拖拽问题 在特定html元素使用 style="-webkit-app-region: drag" 来实现
        width: 1300,
        height: 700,
        webPreferences: {
            // 配置webPreferences的nodeIntegration: true和contextIsolation: false 才可以页面中可以使用node语法映入node模块代码
            //nodeIntegration: false,
            //contextIsolation: false,
            webSecurity: true,// 设置web安全性，设置为false表示关闭比如跨域限制就没了
            /**
             * 该脚本可以在页面的其他脚本执行前执行。脚本可以使用nodejs的api。可以使用require()引入模块使用
             */
            preload: path.join(__dirname,"preload.js")
        }
    })
    // 加载index.html文件
    win.loadFile('index.html')
    //win.loadURL('https://www.baidu.com')

    // Open the DevTools.
    win.webContents.openDevTools()

    // 搜索事件定义， 事件相关文档：https://www.electronjs.org/zh/docs/latest/api/web-contents， 清除搜索选中 BrowserWindow.getFocusedWindow().webContents.stopFindInPage('clearSelection');
    win.webContents.on('found-in-page', (event, search_result) => {
        // activeMatchOrdinal： 当前匹配；matches：总匹配个数
        console.log('搜索事件监听：' , search_result.requestId, search_result.activeMatchOrdinal, search_result.matches, search_result.selectionArea);
    })
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

// 事件处理定义， 正对 asynchronous-message 渠道的事件
let asynchronousMessageEvent = {
    eventKeyMap(){
        let that = this;
        return {
            findText(arg, event){
                that.findTextDeal(arg, event)
            },
        };
    },
    eventDeal(eventKey, arg, event){
        let eventDeal = this.eventKeyMap()[eventKey]
        console.log('寻找事件', arg, eventDeal);

        eventDeal && eventDeal(arg, event)
    },
    findTextDeal(arg, event){
        console.log('搜索搜索', arg)

        // 执行搜索
        let win = BrowserWindow.getFocusedWindow()
        if(win){
            if(arg.isClose){
                win.webContents.stopFindInPage('clearSelection');
            }else{
                let findResult = win.webContents.findInPage(arg.findText, {
                    forward: arg.forward, // true标示向后搜索,false表示向前
                    findNext: true,
                    matchCase: false, // 大小写匹配
                })
                console.log('搜索结果第几个匹配结果（索引从1开始）', findResult)
            }
        }

        // 发送事件给渲染进程
        event.sender.send('renderer_event_listen_1', {msg: 'pong 接收到了搜索信息'})
    },
}

function ready(){
    // ipcMain 仅在主进程中可用。渲染进程可以通过 ipcRenderer.send() 来向这个事件监听器发送消息
    ipcMain.on('asynchronous-message', function(event, arg) {
        console.log('主进程侦听事件', arg);

        // 方式一、给子进程发送消息。子进程可以通过 ipcRenderer.on() 来绑定监听
        //event.sender.send('renderer_event_listen_1', 'pong');

        // 方式二、子进程发送消息。子进程可以通过 ipcRenderer.on() 来绑定监听
        let win = BrowserWindow.getFocusedWindow()
        win && win.webContents.send('renderer_event_listen_1', 'pong ping');

        // 事件处理定义
        asynchronousMessageEvent.eventDeal(arg.msgType, arg, event);
    });

    // 快捷键定义,这个是全局的，不管你在什么软件按这个快捷键都会触发
    false && globalShortcut.register('CommandOrControl+F', () => {
        console.log("主进程快捷键监听")

        // 获取当前窗口
        let win = BrowserWindow.getFocusedWindow()
        // 高亮搜索到的内容，由于这个快捷点是操作系统全局的，要判断是否获取得到win
        if(win){
            let findResult = win.webContents.findInPage("soa", {
                forward: true, // true标示向后搜索,false表示向前
                findNext: true,
                matchCase: false, // 大小写匹配
            })
            console.log('搜索结果第几个匹配结果（索引从1开始）', findResult)

            // found-in-page 会多次设置，这里 win.isSet 标记只设置一次
            !win.isSet && win.webContents.on('found-in-page', (event, search_result) => {
                // activeMatchOrdinal： 当前匹配；matches：总匹配个数
                console.log(search_result.requestId, search_result.activeMatchOrdinal, search_result.matches, search_result.selectionArea);
            });
            win.isSet = true;
        }
    });

    false && globalShortcut.register('CommandOrControl+F+H',  () => {
        // 清除搜索
        let win = BrowserWindow.getFocusedWindow()
        win && win.webContents.stopFindInPage('clearSelection');
    });

    // 创建页面窗口
    createWindow();
}
app.on('ready', ready)

// mac左上角顶部菜单
const template = [
    // { role: 'appMenu' }
    ...(isMac
        ? [{
            label: app.name, // label 表示顶级菜单名称
            submenu: [ // 子级菜单
                { role: 'about' },
                { type: 'separator' }, // 分割线
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }]
        : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac
                ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ]
                : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac
                ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ]
                : [
                    { role: 'close' }
                ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)