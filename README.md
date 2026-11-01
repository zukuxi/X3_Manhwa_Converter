# X3 PDF / Manga Image Folder to XTC / XTCH

一个同时支持 **PDF 文件** 和 **漫画图片** 的 Xteink X3 转换器。转换核心以 `zukuxi/test` 为基础，PDF 与图片统一使用同一套 528 × 792 连续拼接、灰度处理、抖动和 XTC / XTCH 编码逻辑。

## 功能

- **统一文件输入：** 可一次选择一个或多个 PDF、JPG、PNG、WebP、BMP、GIF、AVIF 文件，也可以选择整个文件夹，递归读取其中的 PDF 和漫画图片。
- **自动识别类型：** PDF 使用 PDF.js 渲染；图片按章节文件夹和自然数字顺序排列后逐张处理。
- **统一转换核心：** PDF 页面以 2 倍比例渲染；图片逐张按原始分辨率读取。两种输入最终都进入 `test` 原有的拼接器和图像处理流程。
- **连续拼接：** 目标尺寸 528 × 792，按宽度等比例缩放，连续填充页面，重叠率 0%；每满 792 行输出一页，最后一页底部补白。
- **批量合并：** PDF 可按每 1 / 2 / 3 / 4 / 5 / 10 / 20 个合并；图片文件夹按章节分组，可设置每 N 个章节输出一本。
- **PDF 章节模式：** 可按文件名中的章节号，把标题相同且章节号连续的 PDF 合并。
- **预览：** 查看队列首个 PDF 或图片章节生成的前 5 页。
- **多种输出方式：**
  - 单独下载：转换结果逐本显示，每本都可以单独下载。
  - ZIP：将全部转换结果打包成一个 ZIP 下载。
  - 文件夹：开始转换时选择电脑/设备上的目标文件夹，每本完成后立即保存。
- **XTC / XTCH：** 黑白 XTC 或四级灰度 XTCH。
- **图像设置：** Atkinson、Floyd–Steinberg、Stucki、无抖动；亮度、对比度、抖动强度和黑白阈值。
- **队列管理：** 文件可以上移、下移或删除。
- **本地处理：** PDF 和图片不会上传到转换服务器。

## 图片文件夹结构

建议结构：

```text
漫画名/
├── 第01话/
│   ├── 001.jpg
│   ├── 002.jpg
│   └── 003.jpg
├── 第02话/
│   ├── 001.jpg
│   └── 002.jpg
└── 第03话/
    ├── 001.jpg
    └── 002.jpg
```

图片会按文件夹路径和自然数字顺序排列。图片文件夹的合并数量按章节计算：设为 1 时每章一本，设为 2 时每两章一本，依此类推。直接多选图片时，所选图片按文件名排序并作为一组连续内容处理。

## 统一转换流程

### PDF

1. 使用 PDF.js 以 2 倍比例渲染每一页。
2. 将渲染结果送入 `test` 原有的连续拼接器。
3. 拼接器按 528 像素宽度等比例缩放，并连续填充 528 × 792 页面。
4. 页面满 792 行时，执行原有灰度、抖动和 XTC / XTCH 编码。
5. PDF 组最后不足一页的内容保留在页面顶部，底部补白。

### 漫画图片

1. 按文件夹路径及自然数字顺序逐张读取图片。
2. 每次只创建当前图片的临时画布，不创建整章超长画布。
3. 将图片送入与 PDF 完全相同的 `test` 连续拼接器。
4. 后续灰度、抖动、页面打包及 XTC / XTCH 编码与 PDF 完全共用。
5. 每个输出组结束时，将最后一页底部补白，并从新页面开始下一本。

因此，图片文件夹版不再使用另一套独立的缩放、灰度或分页算法，避免 PDF 与图片转换结果出现两套不同的处理效果。

## 输出方式

- **单独下载：** 转换完成后，在“转换结果”列表中逐本点击下载。
- **打包 ZIP：** 选择 ZIP 模式，转换结束后自动生成 ZIP；也可以在转换完成后点击“下载全部结果 ZIP”。
- **自动保存到文件夹：** 选择文件夹模式，点击开始转换时选择目标文件夹。每一本完成后立即写入目标文件夹，不必等全部转换完成后再统一保存。

直接保存文件夹需要浏览器支持 File System Access API，建议使用支持该功能的 Chrome 或 Edge。若浏览器不支持，可使用单独下载或 ZIP。

## 内存说明

图片处理采用逐张读取、逐张释放临时画布的方式，不会把整个章节拼成一张超长画布。PDF 仍按原项目方式逐页渲染和清理。直接保存文件夹通常比 ZIP 更适合大量输出；ZIP 需要在打包阶段保留输出文件数据。实际内存使用仍取决于浏览器、图片尺寸、PDF 页数和输出数量。

## 使用

1. 将本仓库部署到 GitHub Pages。
2. 选择单个/多个文件，或选择整个文件夹；程序会自动识别 PDF 和漫画图片。
3. 选择 XTC 或 XTCH。
4. 设置每几个 PDF 或章节合并成一本。
5. 调整抖动、亮度和对比度，查看前 5 页预览。
6. 选择单独下载、ZIP 或自动保存到文件夹。
7. 点击开始转换。

## 许可证与致谢

转换器的 PDF 渲染、连续拼接、灰度和 XTC / XTCH 编码核心保留自本项目 `test` 基础版本。原始 XTC 编码项目参考 [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp) 及 [varo6/xtcjs](https://github.com/varo6/xtcjs)。请保留相关项目要求的版权和许可证声明。

---

# X3 PDF / Manga Image Folder to XTC / XTCH

A browser-based converter for **PDF files** and **manga images** for the Xteink X3. Based on `zukuxi/test`, both input types share the same 528 × 792 continuous stitching, grayscale, dithering, and XTC / XTCH encoding pipeline.

## Features

- Select one or multiple supported files (PDF and manga images), or select an entire folder to recursively load both PDFs and images.
- File types are detected automatically; images are ordered by folder path and natural filename order.
- PDFs are rendered at 2×. Images are read one at a time at their original resolution.
- Both input types use the same original `test` stitcher and image-processing pipeline.
- 528 × 792 output pages, continuous stitching, 0% overlap, and white padding on the final partial page.
- Merge PDFs by a chosen number of files; merge image folders by a chosen number of chapters.
- Optional PDF chapter grouping based on consecutive chapter numbers in filenames.
- Preview the first five output pages.
- Download each output separately, create one ZIP containing all outputs, or save each completed book directly to a selected folder.
- XTC black-and-white and XTCH four-level grayscale output.
- Atkinson, Floyd–Steinberg, Stucki, and no-dithering modes, plus brightness, contrast, strength, and threshold controls.
- Local browser processing; source images and PDFs are not uploaded.

## Folder layout

```text
Manga/
├── Chapter 01/
│   ├── 001.jpg
│   └── 002.jpg
├── Chapter 02/
│   ├── 001.jpg
│   └── 002.jpg
└── Chapter 03/
    ├── 001.jpg
    └── 002.jpg
```

Images are sorted by folder path and natural filename order. For image folders, the merge count means chapters per output book. A value of 1 creates one book per chapter; 2 combines every two chapters. When selecting individual images, the selected images are sorted by filename and treated as one continuous sequence.

## Shared conversion pipeline

PDF pages are rendered at 2× and passed to the original `test` continuous stitcher. Manga images are loaded one at a time into temporary canvases and passed to that same stitcher. Both then use the same grayscale processing, dithering, page packing, and XTC / XTCH encoding. No separate image-folder conversion algorithm is used.

## Output options

- **Individual downloads:** Each completed book appears in the results list with its own download control.
- **ZIP:** Automatically create one ZIP after conversion, or click the ZIP button to package all completed outputs.
- **Save to folder:** Choose a destination folder when starting conversion. Each book is written as soon as it is completed.

Direct folder saving requires browser support for the File System Access API. Chrome or Edge is recommended. If unsupported, use individual downloads or ZIP.

## Memory

Images are loaded and processed one at a time. The converter does not build a huge canvas for an entire chapter. PDF pages are rendered and cleaned up sequentially. Direct folder output is generally more suitable for large batches than ZIP, although actual memory use depends on the browser, source dimensions, PDF size, and output count.

## License and acknowledgments

The PDF rendering, continuous stitching, grayscale processing, and XTC / XTCH encoding core are retained from the `test` base project. The original XTC encoding projects include [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp) and [varo6/xtcjs](https://github.com/varo6/xtcjs). Retain applicable copyright and license notices.


### PDF 蒙版兼容模式

设置中保留“蒙版兼容模式（黑页 PDF）”开关，默认关闭。开启后，PDF 预览和正式转换均使用 PDF.js 的 `print` 渲染意图；该选项仅影响 PDF，不影响漫画图片输入。
