# .icns文件生成

资料：https://zhuanlan.zhihu.com/p/348599140

--------------------------------------------------------------------------------
# 生成.icns文件实例
- a. 准备最大尺寸 1024x1024 图片一张，重命名为icon.png，其他大小尺寸可以通过终端命令生成；

- b. 通过鼠标右键或者命令，创建一个名为icons.iconset的文件夹
````
mkdir icons.iconset
````

- c. 通过”终端“来快速创建各种不同尺寸要求的图片文件
在 icon.png 图片所在目录下执行如下语句，生成不同大小的图片
````
sips -z 16 16 icon.png -o icons.iconset/icon_16x16.png
sips -z 32 32 icon.png -o icons.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png -o icons.iconset/icon_32x32.png
sips -z 64 64 icon.png -o icons.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png -o icons.iconset/icon_128x128.png
sips -z 256 256 icon.png -o icons.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png -o icons.iconset/icon_256x256.png
sips -z 512 512 icon.png -o icons.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png -o icons.iconset/icon_512x512.png
sips -z 1024 1024 icon.png -o icons.iconset/icon_512x512@2x.png
````

- d. ”终端“中运行下面的命令，就可以获得名为icon.icns的图标文件了
````
iconutil -c icns icons.iconset -o icon.icns
````
注意：icon.png图片文件和icons.iconset文件夹要保存在同一级目录下，”终端“启动后切换到相同目录。


