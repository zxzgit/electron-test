const { ipcRenderer, remote } = require('electron')

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
