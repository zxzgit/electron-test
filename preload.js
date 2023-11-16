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
// - 一般 网页页面 执行到 渲染进程定义暴露的api通过 contextBridge.exposeInMainWorld() 定义的暴露函数 （如下面的 window.electronIpcRenderer.somethingApi() ） ->  渲染进程通过 ipcRenderer.on('asynchronous-message', args) 来执行事件 -> 主进程通过 ipcMain.on('asynchronous-message', function(event, arg) {})
contextBridge.exposeInMainWorld(
    'electronIpcRendererExpose',
    {
        doThing: () => { // 在网页的页面中就可以使用 window.electronIpcRenderer.doThing(); 来调用
            console.log('exposeInMainWorld_info')
        },
        findText: (findStr, forward, isClose, callback) => { // 在网页的页面中就可以使用 window.electronIpcRenderer.doThing(); 来调用
            console.log('渲染进行暴露api: 搜索事件', callback)

            callback && callback();

            // 触发主进程监听 ipcMain.on('asynchronous-message', function(event, arg) {})
            ipcRenderer.send('asynchronous-message', {msgType: "findText", findText: findStr, forward: forward, isClose: isClose})
            //ipcRenderer.send('asynchronous-message', {msgType: "findText", findText: findStr, callback:() => {}}) // 通信传递的只能是普通文本属性，不能是回掉函数， 由于这里传 callback 会报错 index.html:1309 Uncaught Error: An object could not be cloned.
        },
    }
);
