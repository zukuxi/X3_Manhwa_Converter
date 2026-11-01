# X3 条漫转换器

将条漫 PDF 或图片文件夹转换为 Xteink X3 使用的 XTC / XTCH 文件。所有文件处理均在本机浏览器完成。

https://zukuxi.github.io/X3_Manhwa_Converter/

## 项目基础与来源

本项目以 [x3-manhwa-folder-to-xtc](https://github.com/zukuxi/x3-manhwa-folder-to-xtc) 为基础进行扩展和整合。保留原项目的条漫转换方向，并在此基础上增加 PDF 输入、统一文件处理、队列管理、预览及多种输出方式。

## 输入

- 选择一个或多个 PDF / 图片文件。
- 或选择整个漫画文件夹，递归读取 PDF、JPG、JPEG、PNG、WebP、BMP、GIF、AVIF。
- 图片按自然数字顺序排列，并按章节文件夹分组。
- 漫画名可根据单个文件名、共同文件名前缀或所选文件夹名称自动推断，也可以手动修改。
- 根目录 `Cover.jpg` 可在整部合并模式下作为第一页。

## 队列管理

- 源文件队列按图片章节折叠显示，点击章节可展开查看其中的图片。
- 可拖动章节或文件组的拖动柄调整顺序，支持触屏拖动。
- 展开章节后可删除不需要的单张图片。
- 转换结果支持单独下载和删除，也可打包下载全部结果 ZIP。

## 转换功能

- 目标页面尺寸：528 × 792。
- 输出 XTC 黑白或 XTCH 4 灰阶。
- 支持 Atkinson、Floyd–Steinberg、Stucki 和无抖动等处理方式。
- 支持亮度、对比度、阈值和抖动强度调整。
- PDF 可启用蒙版兼容模式。
- 图片章节支持按章单独输出、整部合并、范围合并或每 N 章合并。
- PDF 支持按数量合并及连续章节模式。
- 支持单独下载、ZIP 下载和选择文件夹自动保存。


## 许可与致谢

本项目基于 [x3-manhwa-folder-to-xtc](https://github.com/zukuxi/x3-manhwa-folder-to-xtc) 扩展。原项目采用 MIT License；请保留仓库中的 `LICENSE` 文件及相关版权声明。
