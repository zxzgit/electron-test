const { contextBridge, ipcRenderer } = require('electron')

// 别去研究 remote 相关的了，以后要废弃了

console.log('预加载脚本执行')

// 定义监听时间. 主进程通过 ipcMain.on() 来向这个监听器发送信息
ipcRenderer.on('renderer_event_listen_1', (event, args) => {
    console.log("子进程监听", args)
    // const electronFind = require('electron-find');
    // let findInPage = new electronFind.FindInPage(remote.getCurrentWebContents());
    //
    // findInPage.openFindWindow()
})

// 给主进程发送消息
ipcRenderer.send('asynchronous-message', {'msg': "msg_for_main_process_xixi-haha_1"})

// reloadjs中的方法和变量都是与页面中的js隔离的，要暴露方法给页面使用，可以使用 contextBridge 来传递
// - window中要 new BrowserWindow() 中 webPreferences.contextIsolation 要为true（默认为true），才会有效果
contextBridge.exposeInMainWorld( // 在页面中就可以使用 window.electron.doThing(); 来调用
    'electron',
    {
        doThing: () => {
            console.log('exposeInMainWorld_info')
        }
    }
);
