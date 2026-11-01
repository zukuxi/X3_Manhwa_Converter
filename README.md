# X3 条漫转换器 | X3 Webtoon Converter

[中文](#中文说明) · [English](#english)

**在线使用 / Live converter:** https://zukuxi.github.io/X3_Manhwa_Converter/

将长条漫画（Webtoon / Manhwa）的 PDF 或图片文件转换为适用于 **Xteink X3** 的 **XTC / XTCH** 文件。支持单个文件、多个文件以及包含章节子文件夹的漫画总文件夹。无需安装桌面软件；文件内容在本机浏览器中读取和处理，不会上传到转换服务器。

---

# 中文说明

## 项目简介与设计思路

Xteink X3 的目标页面尺寸为 **528 × 792 像素**。长条漫画通常由许多纵向图片片段组成。如果把每张图片都单独缩放成一整页，页面容易出现大量空白，阅读也会被切得很碎。

本项目的核心思路是：**把同一章节的图片视为一条连续的漫画内容流，而不是一组互不相关的独立页面。** 转换器按章节顺序读取图片，将内容连续排入 X3 页面，再进行灰度处理和 XTC / XTCH 编码。

本项目以 [X3 Manhwa Folder to XTC Converter](https://github.com/zukuxi/x3-manhwa-folder-to-xtc) 为基础继续扩展，保留条漫章节识别和连续分页方向，并整合 PDF 输入、统一预览、队列管理和多种输出方式。

## 主要功能

### 输入与识别

- **选择单个或多个文件：** 支持 PDF、JPG、JPEG、PNG、WebP、BMP、GIF、AVIF。
- **选择整个文件夹：** 递归读取文件夹中的 PDF 和支持的图片。
- **自然数字排序：** 按文件名及相对路径自然排序，例如 1.jpg、2.jpg、10.jpg，避免字符串排序造成 1、10、2 的错误顺序。
- **章节识别：** 根据图片所在文件夹组织图片章节。
- **漫画名自动填写：** 单个文件优先使用文件名；选择整个文件夹时使用根文件夹名称；多文件选择时尝试从共同文件名前缀推断。漫画名仍可手动修改。
- **根目录封面：** 如果漫画根目录中存在 Cover.jpg，可选择在“整部合并成一本”模式下将它放在第一页。

### 条漫连续分页：核心处理方式

1. 按自然排序读取章节中的图片。
2. 将当前图片按比例缩放到 **528 像素宽**，不强行把每张原图缩成一整页。
3. 按顺序把图片内容连续绘制到 **528 × 792 像素**的页面画布。
4. 如果一张图片结束后当前页还有空间，下一张图片会继续填入剩余区域；不会因为源图片文件边界而强制换页。
5. 页面填满后，完成当前页的灰度处理、抖动和编码，再继续处理后续内容。
6. 一本书的最后一页如果没有填满，会用白色补齐。
7. 每个输出分组独立开始分页，不会把上一本书未完成的内容接到下一本书。

这种方式适合由连续截图或切片组成的长条漫画：尽量保持阅读内容连续，避免每张图片各占一页产生的空白，也避免先把整章拼成一张超长图片。

### PDF 转换

- 使用 PDF.js 逐页读取 PDF。
- PDF 页面以 **2 倍比例**渲染，再进入与图片相同的连续分页、灰度、抖动和 XTC / XTCH 编码流程。
- **蒙版兼容模式**暂时无效，如果预览是白色或者黑色的pdf用 https://github.com/zukuxi/x3-manhwa-pdf-to-xtc 但质量可能没这个好，也差的不多
- **PDF 合并数量：** 可设置每几份 PDF 合并成一本。
- **PDF 章节模式：** 可将标题相同且章节号连续的 PDF 文件识别为同一作品并合并。

### 图片章节生成方式

- **每章单独一本：** 每个图片章节分别输出。
- **整部合并成一本：** 将识别到的图片章节合并为一本。
- **指定章节范围合并：** 选择起始章节和结束章节。
- **每 N 章合并成一本：** 按指定章节数量分组输出。

图片章节生成方式与 PDF 合并数量分别控制两类输入，不会互相改变。

### 队列、预览与输出

- **章节折叠队列：** 图片按章节分组显示，默认折叠；点击章节可展开查看其中的图片。
- **触屏拖动排序：** 可通过章节前的拖动手柄调整章节顺序，支持鼠标和触屏操作。
- **单项删除：** 可从队列中删除不需要转换的文件；转换结果也可以单独删除。
- **前 5 页预览：** 可预览队列首个 PDF 或图片章节转换后的前五页，并切换预览来源。
- **三种输出方式：** 单独下载、打包为 ZIP、转换开始时选择目标文件夹并自动保存。
- **输出文件名：** 可修改漫画名，转换器会据此生成输出文件名。

## 输出格式与图像设置

| 格式 | 显示方式 | 说明 |
|---|---|---|
| XTC | 黑白（1-bit） | 文件较小，适合黑白线稿 |
| XTCH | 四级灰阶 | 可保留更多灰度层次 |

可调整的图像设置：

- **抖动算法：** Atkinson、Floyd–Steinberg、Stucki、无抖动。
- **对比度：** 无、轻度、中等、强。
- **亮度：** 调整图像整体明暗。
- **黑白阈值：** 在无抖动模式下控制黑白分界。
- **抖动强度：** 调整误差扩散效果的强弱。

不同漫画扫描质量和画面风格适合的参数可能不同。建议先查看前五页预览，再开始整批转换。

## 内存与处理方式

本项目优先采用逐张、逐页处理，而不是把整部漫画或整章内容一次性拼成一张巨大画布：

- 图片逐张解码并送入分页器；当前图片处理完成后会释放临时画布引用。
- PDF 逐页渲染；页面处理后清理页面资源，完成后销毁 PDF 文档对象。
- 每本输出书籍独立分页，避免跨书籍保留未完成页面。
- ZIP 打包需要在打包阶段保留输出文件数据，可能比逐本保存占用更多内存。
- 浏览器何时真正回收内存由其垃圾回收机制决定；释放临时对象不代表内存会立即归还给操作系统。

大型漫画建议分批转换。实际可处理规模取决于浏览器、设备内存、源图片尺寸、PDF 页数及输出方式。

## 使用步骤

1. 打开[在线转换器](https://zukuxi.github.io/X3_Manhwa_Converter/)。
2. 选择一个或多个 PDF / 图片文件，或选择整个漫画文件夹。
3. 检查自动填写的漫画名；需要时可自行修改。
4. 根据输入类型设置图片章节生成方式或 PDF 合并数量。
5. 选择 XTC / XTCH，调整抖动算法、对比度、亮度等参数。
6. 查看前五页预览。
7. 选择单独下载、ZIP 或自动保存到文件夹，然后开始转换。

## 隐私与依赖

PDF、图片及生成文件均在本机浏览器内处理，不会上传到转换服务器。网页会从 CDN 加载 PDF.js、JSZip 和 SortableJS 等依赖；加载这些网页资源需要网络连接。转换过程使用本机设备的 CPU 和内存。

## 许可与致谢

本项目以 [zukuxi/x3-manhwa-folder-to-xtc](https://github.com/zukuxi/x3-manhwa-folder-to-xtc) 为基础扩展。项目中保留了 [varo6/xtcjs](https://github.com/varo6/xtcjs) 的 MIT 许可版权声明。原条漫文件夹转换器的项目说明也记录了对 [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp) 的早期参考。**感谢 varo6 和 srokl 的开源工作**，以及相关开源依赖的维护者。

请保留仓库中的 LICENSE 文件及其版权声明。具体许可条款以许可证文件为准。

---

# English

## Overview and design principles

X3 Webtoon Converter turns webtoon / manhwa PDFs and image folders into **XTC / XTCH** files for the **Xteink X3**. You can select individual files, multiple files, or an entire comic folder containing chapter subfolders. No desktop installation is required. Source files are processed locally in your browser and are not uploaded to a conversion server.

The Xteink X3 page size is **528 × 792 pixels**. Long-strip comics are often distributed as many vertically sliced images. Treating every source image as a separate page can create large blank areas and interrupt the reading flow.

The main design principle is to **treat chapter images as one continuous stream of comic content, rather than unrelated individual pages**. Images are read in order, stitched continuously into X3-sized pages, then processed and encoded as XTC / XTCH.

This project extends [X3 Manhwa Folder to XTC Converter](https://github.com/zukuxi/x3-manhwa-folder-to-xtc), retaining its chapter-oriented long-strip workflow while adding PDF input, unified preview, queue management, and multiple output methods.

## Features

### Input and organization

- **Select one or more files:** PDF, JPG, JPEG, PNG, WebP, BMP, GIF, and AVIF.
- **Select an entire folder:** Recursively reads supported PDFs and images.
- **Natural sorting:** Sorts filenames and relative paths naturally, so 1.jpg, 2.jpg, and 10.jpg stay in the expected order.
- **Chapter detection:** Organizes images into chapters based on their containing folders.
- **Automatic comic title:** Uses a single file's name, the selected root folder name, or an inferred common filename prefix for multiple files. The title remains editable.
- **Root cover image:** If the comic root contains Cover.jpg, it can be placed as the first page in whole-series merge mode.

### Continuous long-strip pagination

The target page size is **528 × 792 pixels**.

1. Read chapter images in natural order.
2. Resize each image proportionally to **528 pixels wide**. The converter does not force every source image to fill an entire page.
3. Draw image content continuously onto a **528 × 792 pixel** page canvas.
4. If space remains after one source image, content from the next image continues in the remaining area. A new page is not forced at every source-file boundary.
5. When a page is full, it is processed with grayscale conversion and dithering, then encoded before processing continues.
6. The final incomplete page of a book is padded with white.
7. Each output book starts with a fresh pagination state; unfinished content is never carried over from one book to the next.

This approach is designed for long-strip comics made of consecutive screenshots or slices. It reduces blank space caused by treating every slice as a full page and avoids building one enormous canvas for an entire chapter.

### PDF conversion

- PDFs are read page by page with PDF.js.
- Each PDF page is rendered at **2× scale**, then sent through the same continuous pagination, grayscale, dithering, and XTC / XTCH encoding pipeline used for images.
- **Mask compatibility mode** applies to PDFs only. When enabled, PDF.js uses its print rendering intent to help work around black pages or mask-rendering issues. It is off by default.
- **PDF merge count:** Choose how many PDF files are combined into one output book.
- **PDF chapter mode:** Consecutive PDF files with matching titles and chapter numbers can be grouped into one work.

### Image chapter output modes

- **One book per chapter:** Export each image chapter separately.
- **Merge the whole series:** Combine all detected image chapters into one book.
- **Merge a chapter range:** Select the first and last chapters to include.
- **Merge every N chapters:** Split the series into books containing a chosen number of chapters.

Image chapter output and PDF merge count are separate controls for their respective input types.

### Queue, preview, and export

- **Collapsible chapter queue:** Images are grouped by chapter. Expand a chapter to inspect its individual files.
- **Touch and mouse reordering:** Drag a chapter using its handle to change the processing order.
- **Remove individual items:** Remove unwanted source files from the queue or delete completed output items.
- **First-five-page preview:** Preview the first five generated pages from the first queued PDF or an image chapter, and switch the preview source.
- **Three export methods:** Download each book separately, package all outputs into a ZIP, or choose a destination folder at conversion time for automatic saving.
- **Editable output title:** Change the comic title used for output filenames.

## Output formats and image controls

| Format | Display | Notes |
|---|---|---|
| XTC | Black and white (1-bit) | Smaller files; suitable for monochrome line art |
| XTCH | Four-level grayscale | Preserves more grayscale information |

Available image controls:

- **Dithering:** Atkinson, Floyd–Steinberg, Stucki, or none.
- **Contrast:** None, Light, Medium, or Strong.
- **Brightness:** Adjusts overall image brightness.
- **Black-and-white threshold:** Controls the monochrome cutoff when dithering is disabled.
- **Dithering strength:** Adjusts the strength of the dithering effect.

Review the first five preview pages before starting a large batch; the best settings depend on the comic's scan quality and artwork.

## Memory-conscious processing

The converter processes images and PDF pages incrementally instead of combining an entire comic or chapter into one huge canvas:

- Images are decoded one at a time and passed to the page stitcher. Temporary canvas references are released after processing.
- PDFs are rendered page by page. Page resources are cleaned up after use, and the PDF document is destroyed when finished.
- Each output book has an independent pagination state.
- ZIP creation may require additional memory because output data must be retained while the archive is assembled.
- Actual memory reclamation is controlled by the browser's garbage collector. Releasing temporary objects does not guarantee that memory is immediately returned to the operating system.

For very large comics, consider converting in smaller batches. Practical limits depend on the browser, device memory, source image dimensions, PDF page count, and export method.

## How to use

1. Open the [live converter](https://zukuxi.github.io/X3_Manhwa_Converter/).
2. Select one or more PDF / image files, or choose the entire comic folder.
3. Review the automatically detected comic title and edit it if needed.
4. Configure image chapter output or PDF merge count, depending on the input.
5. Choose XTC / XTCH and adjust dithering, contrast, brightness, and other image settings.
6. Review the first five preview pages.
7. Choose individual downloads, ZIP export, or automatic folder saving, then start conversion.

## Privacy and dependencies

PDFs, images, and generated files are processed locally in your browser and are not uploaded to a conversion server. The web page loads dependencies such as PDF.js, JSZip, and SortableJS from CDNs, so an internet connection is needed to load those resources. Conversion uses your device's CPU and memory.

## License and acknowledgments

This project extends [zukuxi/x3-manhwa-folder-to-xtc](https://github.com/zukuxi/x3-manhwa-folder-to-xtc). The repository retains the MIT copyright notice for [varo6/xtcjs](https://github.com/varo6/xtcjs). The original folder-converter project also documents its earlier reference to [srokl/xtcjsapp](https://github.com/srokl/xtcjsapp). **Thanks to varo6 and srokl for their open-source work**, and to the maintainers of the open-source dependencies used by this project.

Please keep the repository's LICENSE file and its copyright notices. Refer to the license file for the applicable license terms.
