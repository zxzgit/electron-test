# 这个为 electron 的测试项目

# 搭建
- 1、复制 `index.example.html` 为 index.html
- 2、`npm run start`就可以启动测试
- 3、打包：`npm run builder-package-mac`打包可执行程序

# 常见问题

## 1、eletron 包无法下载

需要编辑：vi ~/.npmrc 不然 npm install eletron 一直下载不下来

在 ~/.npmrc 中添加如下内容
````
registry=https://registry.npm.taobao.org/
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
````