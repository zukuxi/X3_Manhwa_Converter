(async function () {
  let pdfjsLib = null;
  let pdfjsLoadError = null;

  // Try two CDNs so one failed CDN does not immediately break the app.
  
const pdfjsSources = [
  {
    main: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.54/build/pdf.min.mjs',
    worker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs'
  },
  {
    main: 'https://unpkg.com/pdfjs-dist@5.4.54/build/pdf.min.mjs',
    worker: 'https://unpkg.com/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs'
  }
];


  for (const source of pdfjsSources) {
    try {
      pdfjsLib = await import(source.main);
      pdfjsLib.GlobalWorkerOptions.workerSrc = source.worker;
      pdfjsLoadError = null;
      break;
    } catch (error) {
      pdfjsLoadError = error;
      console.error('PDF.js CDN failed:', source.main, error);
    }
  }

  const W = 528;
  const H = 792;
  const $ = id => document.getElementById(id);

  const dict = {
    zh: {
      heading: 'X3 条漫转换器',
      lead: '将条漫 PDF 或图片文件夹转换为 X3 使用的 XTC / XTCH 文件。所有处理均在本机浏览器完成。',
      chooseComic: '① 选择条漫',
      pickerHint: '可以选择单个或多个 PDF / 图片文件，也可以选择包含章节文件夹的漫画总文件夹。',
      pickFiles: '选择单个或多个文件',
      pickFolder: '选择整个文件夹',
      titleLabel: '漫画名（可修改）',
      includeCover: '如果根目录有 Cover.jpg，在整部合并模式下作为第一页',
      generationTitle: '② 生成方式',
      outputModeLabel: '图片章节生成方式',
      modeChapter: '每章单独一本',
      modeMerge: '整部合并成一本',
      modeRange: '指定章节范围合并',
      modeBatch: '每 N 章合并成一本',
      fromChapterLabel: '从章节',
      toChapterLabel: '到章节',
      chaptersPerBookLabel: '每本包含章节数',
      pdfMergeLabel: 'PDF 合并数量',
      settingsTitle: '③ 转换设置',
      maskModeShort: '启用（仅 PDF）',
      depthLabel: '输出格式',
      ditherLabel: '抖动算法',
      thresholdLabel: '黑白阈值（无抖动时）',
      contrastLabel: '对比度',
      brightnessLabel: '亮度',
      maskModeLabel: '蒙版兼容模式',
      strengthLabel: '抖动强度',
      chapterMode: 'PDF 章节模式：将标题相同、章节号连续的文件合并',
      previewTitle: '前 5 页预览',
      previewSourceLabel: '预览内容',
      previewFirstItem: '队列首个文件',
      previewHint: '可预览队列首个文件，也可以切换到任意图片章节查看前 5 页。',
      downloadModeLabel: '下载方式',
      individualMode: '单独下载',
      zipMode: '打包 ZIP',
      folderMode: '自动保存到文件夹（开始转换时选择）',
      folderNotChosen: '尚未选择保存文件夹。',
      folderChosen: '已选择保存文件夹：',
      outputsTitle: '转换结果',
      start: '开始转换', cancel: '取消', zipDownload: '下载全部结果 ZIP', clear: '清空队列',
      remove: '删除', queueTitle: '源文件队列', queueHint: '可调整文件顺序，也可以删除不需要转换的文件。',
      languageLabel: '语言 / Language',
      selectFirst: '尚未选择条漫。', noPdf: '没有找到支持的 PDF 或图片文件。',
      alreadyAdded: '文件已在队列中。', added: '已加入', pdfUnit: '个文件。',
      waiting: '等待转换', converting: '转换中', done: '完成', failed: '失败',
      removed: '已从队列删除该文件。', cleared: '队列已清空。', completedHint: '转换完成后显示结果。',
      pdfRemoved: '已从队列删除该文件。',
      noFolderSupport: '当前浏览器不支持直接保存到文件夹。请使用支持此功能的 Chrome/Edge，或改用单独下载/ZIP。',
      folderCancelled: '已取消选择保存文件夹。', folderReady: '保存文件夹已选择：',
      needFolder: '请先选择保存文件夹，再开始转换。', folderSaveFailed: '保存到文件夹失败：',
      folderSaved: '已保存：', saving: '正在保存文件：', zipBuilding: '正在打包 ZIP…',
      zipReady: 'ZIP 打包完成：', zipUnit: '个文件。', convertingGroup: '第', group: '组',
      pdfPage: 'PDF 页', x3Page: 'X3 页面', previewFailed: '预览失败：',
      pdfjsFailed: 'PDF.js 加载失败。请检查网络/CDN 后刷新，具体原因请查看浏览器控制台。',
      cancelRequested: '已请求取消，当前文件处理结束后停止。', cancelled: '已取消。成功',
      finished: '转换结束。成功', successUnit: '组，失败', groupUnit: '组。',
      conversionFailed: '转换失败：', browserFolderPermission: '浏览器没有获得保存文件夹的写入权限，请重新选择文件夹并允许访问。',
      autoZipFailed: 'ZIP 生成失败：', saveFailed: '文件转换成功，但保存失败：'
    },
    en: {
      heading: 'X3 Webtoon Converter',
      lead: 'Convert webtoon PDFs or image folders to XTC / XTCH files for Xteink X3. All processing stays in your browser.',
      chooseComic: '① Select webtoon',
      pickerHint: 'Select one or more PDF / image files, or choose the whole folder containing chapter folders.',
      pickFiles: 'Select one or more files',
      pickFolder: 'Select an entire folder',
      titleLabel: 'Webtoon title (editable)',
      includeCover: 'Use root Cover.jpg as the first page in whole-book mode',
      generationTitle: '② Generation mode',
      outputModeLabel: 'Image chapter output',
      modeChapter: 'One book per chapter',
      modeMerge: 'Merge the whole series into one book',
      modeRange: 'Merge a chapter range',
      modeBatch: 'Merge every N chapters',
      fromChapterLabel: 'From chapter',
      toChapterLabel: 'To chapter',
      chaptersPerBookLabel: 'Chapters per book',
      pdfMergeLabel: 'PDF merge count',
      settingsTitle: '③ Conversion settings',
      maskModeShort: 'Enable (PDF only)',
      depthLabel: 'Output format',
      ditherLabel: 'Dithering algorithm',
      thresholdLabel: 'Threshold (when dithering is off)',
      contrastLabel: 'Contrast',
      brightnessLabel: 'Brightness',
      maskModeLabel: 'Mask compatibility mode (black-page PDFs)',
      maskModeHint: 'PDF only. Uses PDF.js print rendering to work around black pages or mask-rendering issues. Off by default.',
      strengthLabel: 'Dithering strength',
      mergeLabel: 'Merge every N PDFs into one book',
      chapterMode: 'PDF chapter mode: merge consecutive files with matching titles',
      chapterHint: 'For example, “[Chapter 1] HEADON\'s Floor.pdf” and “[Chapter 2] HEADON\'s Floor.pdf” merge into “1-2 HEADON\'s Floor.xtch”.',
      methodHint: 'PDFs and images use the same stitching, grayscale, dithering and XTC/XTCH encoding logic from test. PDFs are rendered at 2×; images are processed one at a time at original resolution.',
      previewTitle: 'First 5 output pages preview',
      previewSourceLabel: 'Preview source',
      previewFirstItem: 'First item in queue',
      previewHint: 'Preview the first queued file or switch to any image chapter to view its first five output pages.',
      downloadModeLabel: 'Download method',
      individualMode: 'Download individually',
      zipMode: 'Create a ZIP',
      folderMode: 'Auto-save to folder (choose when starting)',
      folderNotChosen: 'No destination folder selected.',
      folderChosen: 'Destination folder selected: ',
      outputsTitle: 'Output files',
      start: 'Start conversion',
      cancel: 'Cancel',
      zipDownload: 'Download all results as ZIP',
      clear: 'Clear queue',
      remove: 'Remove',
      queueTitle: 'Source file queue',
      queueHint: 'Reorder files or remove items you do not want to convert.',
      languageLabel: 'Language',
      selectFirst: 'Select files or an entire folder first.',
      noPdf: 'No supported PDF or image files found.',
      alreadyAdded: 'Files are already in the queue.',
      added: 'Added',
      pdfUnit: 'file(s).',
      waiting: 'Waiting',
      converting: 'Converting',
      done: 'Done',
      failed: 'Failed',
      removed: 'File removed from the queue.',
      cleared: 'Queue cleared.',
      completedHint: 'Completed files will appear here.',
      pdfRemoved: 'File removed from the queue.',
      noFolderSupport: 'Direct folder saving is not supported in this browser. Use a compatible Chrome/Edge browser or download individually/ZIP.',
      folderCancelled: 'Folder selection cancelled.',
      folderReady: 'Destination folder selected: ',
      needFolder: 'Choose a destination folder before starting conversion.',
      folderSaveFailed: 'Folder save failed: ',
      folderSaved: 'Saved: ',
      saving: 'Saving file: ',
      zipBuilding: 'Building ZIP…',
      zipReady: 'ZIP ready: ',
      zipUnit: 'file(s).',
      convertingGroup: 'Group',
      group: '',
      pdfPage: 'PDF page',
      x3Page: 'X3 pages',
      previewFailed: 'Preview failed: ',
      pdfjsFailed: 'PDF.js could not load. Check your network/CDN and refresh. Details are in the browser console.',
      cancelRequested: 'Cancellation requested; the current source page or image will finish first.',
      cancelled: 'Cancelled. Completed ',
      finished: 'Finished. Successful ',
      successUnit: ', failed ',
      groupUnit: '.',
      conversionFailed: 'Conversion failed: ',
      browserFolderPermission: 'The browser does not have write permission for this folder. Select it again and allow access.',
      autoZipFailed: 'ZIP creation failed: ',
      saveFailed: 'Conversion succeeded, but saving failed: '
    }
  };

  let lang = 'zh';
  let queue = [];
  let outputs = [];
  let cancelled = false;
  let running = false;
  let previewPdf = null;
  let previewPages = [];
  let previewIndex = 0;
  let previewKey = '';
  let previewRequestId = 0;
  let outputDirectoryHandle = null;
  let savingFolder = false;
  let titleWasEdited = false;
  const expandedQueueGroups = new Set();
  let queueSortable = null;

  const collator = new Intl.Collator('zh-CN', {
    numeric: true,
    sensitivity: 'base'
  });

  function tr(key) {
    return dict[lang][key] ?? dict.zh[key] ?? key;
  }

  function status(message, progress) {
    $('status').textContent = message;

    if (progress !== undefined) {
      $('bar').style.width =
        Math.max(0, Math.min(100, progress)) + '%';
    }
  }

  function applyLang() {
    lang = $('language').value === 'en' ? 'en' : 'zh';
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = tr(key);
    });

    updateFolderStatus();
    renderQueue();
    renderOutputs();
    updatePreviewSources();
    updatePageLabel();

    // Do not replace an active progress message just because the language changed.
    if (pdfjsLoadError) {
      status(tr('pdfjsFailed') + ' ' + pdfjsLoadError.message, 0);
    }
  }

  $('language').addEventListener('change', applyLang);

  function selectedDownloadMode() {
    return $('downloadMode').value || 'individual';
  }

  function updateFolderStatus() {
    const el = $('folderStatus');
    if (!el) return;

    el.textContent = outputDirectoryHandle
      ? tr('folderChosen') + outputDirectoryHandle.name
      : tr('folderNotChosen');
  }

  function safeName(value) {
    return (value || 'converted')
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
      .replace(/[. ]+$/, '')
      .trim() || 'converted';
  }

  function fileKey(file) {
    return `${file.name}|${file.size}|${file.lastModified}|${file.webkitRelativePath || ''}`;
  }

  function sourceFolderPath(group) {
    const path = group[0]?.file.webkitRelativePath || '';
    const parts = path.split('/').filter(Boolean);
    return parts.slice(0, -1).map(safeName);
  }

  const imageExt = /\.(jpe?g|png|webp|bmp|gif|avif)$/i;

  function addFiles(files) {
    const known = new Set(queue.map(item => fileKey(item.file)));
    const arr = [...files]
      .map(file => ({
        file,
        type: /\.pdf$/i.test(file.name)
          ? 'pdf'
          : (imageExt.test(file.name) && (!file.type || file.type.startsWith('image/')) ? 'image' : null)
      }))
      .filter(item => item.type)
      .sort((a, b) => collator.compare(
        a.file.webkitRelativePath || a.file.name,
        b.file.webkitRelativePath || b.file.name
      ));

    let added = 0;
    for (const entry of arr) {
      const { file, type } = entry;
      const key = fileKey(file);
      if (!known.has(key)) {
        queue.push({ file, type, state: 'waiting' });
        known.add(key);
        added++;
      }
    }

    if (added) {
      status(`${tr('added')} ${added} ${tr('pdfUnit')}`, 0);
      const imageCount = arr.filter(item => item.type === 'image').length;
      const pdfCount = arr.filter(item => item.type === 'pdf').length;
      const chapterCount = new Set(queue.filter(item => item.type === 'image' && !isRootCover(item.file)).map(item => imageChapterOf(item.file))).size;
      $('fileStatus').textContent = lang === 'en'
        ? `Loaded ${queue.length} files (${queue.filter(item => item.type === 'pdf').length} PDFs, ${queue.filter(item => item.type === 'image').length} images), with ${chapterCount} image chapters detected.`
        : `已读取 ${queue.length} 个文件（PDF ${queue.filter(item => item.type === 'pdf').length} 个，图片 ${queue.filter(item => item.type === 'image').length} 张），识别到 ${chapterCount} 个图片章节。`;
      previewKey = '';
      loadPreview();
    } else if (arr.length) {
      status(tr('alreadyAdded'), 0);
    } else {
      status(tr('noPdf'), 0);
    }
    renderQueue();
    updatePreviewSources();
    updateGenerationFields();
    if (added && !titleWasEdited) {
      const addedFiles = arr.map(entry => entry.file);
      $('title').value = inferComicTitle(addedFiles);
    }
  }

  function inferComicTitle(files) {
    const usable = files.filter(file => !isRootCover(file));
    if (!usable.length) return '';
    const relativePaths = usable.map(file => (file.webkitRelativePath || '').split('/').filter(Boolean));
    const folderPaths = relativePaths.filter(parts => parts.length > 1);
    // Folder selection: use the selected root folder name, not the first chapter/file.
    if (folderPaths.length && folderPaths.length === usable.length) return folderPaths[0][0];
    // One explicitly selected PDF/image: use its filename without extension.
    if (usable.length === 1) return usable[0].name.replace(/\.[^.]+$/, '');
    // Multi-file selection: infer the common comic title from filenames such as Comic 01.pdf.
    const stems = usable.map(file => file.name.replace(/\.[^.]+$/, ''));
    let prefix = stems[0];
    for (const stem of stems.slice(1)) {
      let i = 0;
      while (i < prefix.length && i < stem.length && prefix[i].toLowerCase() === stem[i].toLowerCase()) i++;
      prefix = prefix.slice(0, i);
    }
    prefix = prefix.replace(/[\s._-]*\d+[\s._-]*$/, '').replace(/[\s._-]+$/, '').trim();
    return prefix.length >= 2 ? prefix : stems[0];
  }

  $('title').addEventListener('input', () => { titleWasEdited = true; });

  $('pickFiles').addEventListener('click', () => $('file').click());
  $('pickFolder').addEventListener('click', () => $('folder').click());
  $('file').addEventListener('change', event => {
    addFiles(event.target.files);
    event.target.value = '';
  });
  $('folder').addEventListener('change', event => {
    addFiles(event.target.files);
    event.target.value = '';
    updateGenerationFields();
  });

  function queueGroupKey(item, index) {
    if (item.type === 'image') {
      const parts = (item.file.webkitRelativePath || '').split('/').filter(Boolean);
      const parent = parts.length > 1 ? parts.slice(0, -1).join('/') : '未分章图片';
      return `image:${parent}`;
    }
    return `pdf:${fileKey(item.file)}:${index}`;
  }

  function getQueueGroups() {
    const groups = [];
    const byKey = new Map();
    queue.forEach((item, index) => {
      const key = queueGroupKey(item, index);
      let group = byKey.get(key);
      if (!group) {
        group = { key, type: item.type, items: [] };
        byKey.set(key, group);
        groups.push(group);
      }
      group.items.push(item);
    });
    return groups;
  }

  function renderQueue() {
    const ul = $('queue');
    ul.replaceChildren();
    $('queueCount').textContent = String(queue.length);

    if (!queue.length) {
      const li = document.createElement('li');
      li.className = 'hint';
      li.textContent = tr('selectFirst');
      ul.append(li);
    }

    const groups = getQueueGroups();
    for (const group of groups) {
      const li = document.createElement('li');
      li.className = 'queue-group';
      li.dataset.groupKey = group.key;

      const head = document.createElement('div');
      head.className = 'group-head';

      if (!running) {
        const handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.textContent = '⠿';
        handle.title = lang === 'en' ? 'Drag to reorder' : '按住拖动调整顺序';
        head.append(handle);
      }

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'chapter-toggle';
      const isImageGroup = group.type === 'image';
      const firstFile = group.items[0].file;
      const parts = (firstFile.webkitRelativePath || '').split('/').filter(Boolean);
      const label = isImageGroup
        ? (parts.length > 1 ? parts.at(-2) : '未分章图片')
        : firstFile.name;
      const totalSize = group.items.reduce((sum, item) => sum + item.file.size, 0);
      const done = group.items.filter(item => item.state === 'done').length;
      const failed = group.items.filter(item => item.state === 'failed').length;
      const meta = document.createElement('span');
      meta.className = 'chapter-meta';
      meta.textContent = isImageGroup
        ? `${group.items.length} 张图片 · ${(totalSize / 1024 / 1024).toFixed(2)} MB${done ? ` · ${done} 完成` : ''}${failed ? ` · ${failed} 失败` : ''}`
        : `${(totalSize / 1024 / 1024).toFixed(2)} MB · ${tr(group.items[0].state)}`;
      toggle.append(document.createTextNode(`${isImageGroup ? '📁 ' : '📄 '}${label}`), meta);
      const arrow = document.createElement('span');
      arrow.className = 'group-arrow';
      const expanded = expandedQueueGroups.has(group.key);
      arrow.textContent = expanded ? '▾' : '▸';
      toggle.append(arrow);
      toggle.onclick = () => {
        if (expandedQueueGroups.has(group.key)) expandedQueueGroups.delete(group.key);
        else expandedQueueGroups.add(group.key);
        renderQueue();
      };
      head.append(toggle);
      li.append(head);

      const sublist = document.createElement('ul');
      sublist.className = 'queue-sublist';
      sublist.hidden = !expanded;
      group.items.forEach(item => {
        const child = document.createElement('li');
        const info = document.createElement('div');
        info.className = 'file-info';
        const name = document.createElement('div');
        name.className = 'filename';
        name.textContent = item.file.webkitRelativePath || item.file.name;
        const detail = document.createElement('div');
        detail.className = 'file-detail';
        detail.textContent = `${(item.file.size / 1024 / 1024).toFixed(2)} MB`;
        info.append(name, detail);
        const state = document.createElement('span');
        state.className = 'file-state ' + (item.state === 'done' ? 'ok' : item.state === 'failed' ? 'err' : '');
        state.textContent = tr(item.state);
        child.append(info, state);
        if (!running) {
          const controls = document.createElement('span');
          controls.className = 'file-controls';
          const removeButton = document.createElement('button');
          removeButton.className = 'secondary small';
          removeButton.textContent = tr('remove');
          removeButton.onclick = () => {
            const index = queue.indexOf(item);
            if (index >= 0) queue.splice(index, 1);
            renderQueue();
            updateGenerationFields();
            updatePreviewSources();
            loadPreview();
            status(tr('removed'), 0);
          };
          controls.append(removeButton);
          child.append(controls);
        }
        sublist.append(child);
      });
      li.append(sublist);
      ul.append(li);
    }

    if (window.Sortable) {
      if (queueSortable) queueSortable.destroy();
      if (!running && groups.length > 1) {
        queueSortable = new Sortable(ul, {
          animation: 160,
          handle: '.drag-handle',
          draggable: '.queue-group',
          delay: 120,
          delayOnTouchOnly: true,
          touchStartThreshold: 4,
          onEnd: () => {
            const orderedKeys = [...ul.querySelectorAll(':scope > .queue-group')].map(el => el.dataset.groupKey);
            const currentGroups = getQueueGroups();
            const groupMap = new Map(currentGroups.map(group => [group.key, group]));
            queue = orderedKeys.flatMap(key => groupMap.get(key)?.items || []);
            renderQueue();
            updatePreviewSources();
            previewKey = '';
            loadPreview();
          }
        });
      }
    }

    const hasPending = queue.some(item => item.state === 'waiting' || item.state === 'failed');
    $('go').disabled = running || !hasPending;
    $('clear').disabled = running || (!queue.length && !outputs.length);
    $('cancel').disabled = !running;
    $('zip').disabled = running || savingFolder || !outputs.length;
  }

  function renderOutputs() {
    const ul = $('outputs');
    ul.replaceChildren();
    $('outCount').textContent = String(outputs.length);

    if (!outputs.length) {
      const li = document.createElement('li');
      li.className = 'hint';
      li.textContent = tr('completedHint');
      ul.append(li);
      return;
    }

    outputs.forEach((output, index) => {
      const li = document.createElement('li');
      const info = document.createElement('div');
      info.className = 'file-info';

      const name = document.createElement('div');
      name.className = 'filename';
      name.textContent = `${index + 1}. ${output.name}`;

      const detail = document.createElement('div');
      detail.className = 'file-detail';
      detail.textContent =
        `${output.files} ${output.type === 'image' ? (lang === 'en' ? 'images' : '张图片') : 'PDF'} · ${output.pages} X3 pages · ` +
        `${(output.blob.size / 1024 / 1024).toFixed(2)} MB`;

      info.append(name, detail);

      const button = document.createElement('button');
      button.className = 'small';
      button.textContent = lang === 'en' ? 'Download' : '下载';
      button.disabled = running || savingFolder;
      button.onclick = () => download(output.blob, output.name);

      const removeButton = document.createElement('button');
      removeButton.className = 'small output-remove secondary';
      removeButton.textContent = lang === 'en' ? 'Delete' : '删除';
      removeButton.disabled = running || savingFolder;
      removeButton.onclick = () => {
        if (running || savingFolder) return;
        outputs.splice(index, 1);
        renderOutputs();
        renderQueue();
        status(lang === 'en' ? 'Output deleted.' : '已删除这本转换结果。', 0);
      };

      li.append(info, button, removeButton);
      ul.append(li);
    });
  }

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }

  function parseChapter(file) {
    const stem = file.name.replace(/\.(pdf|jpe?g|png|webp|bmp|gif|avif)$/i, '');
    const match = stem.match(
      /(?:^|[\s\[【(（])(?:第\s*)?(\d+)\s*(?:话|話|章|回)\s*[\]】)）]?\s*[-_.、：:]?\s*(.*?)\s*$/i
    );

    if (!match) return null;

    const title = match[2].trim();

    return {
      n: Number(match[1]),
      title,
      key: title.replace(/\s+/g, ' ').toLowerCase()
    };
  }

  function isRootCover(file) {
    const parts = (file.webkitRelativePath || '').split('/').filter(Boolean);
    return parts.length === 2 && /^cover\.(jpe?g|png|webp|bmp|gif|avif)$/i.test(parts[1]);
  }

  function imageChapterOf(file) {
    const relative = file.webkitRelativePath || '';
    if (!relative) return '未分章图片';
    const parts = relative.split('/').filter(Boolean);
    if (parts.length < 3) return '未分章图片';

    // Ignore the selected root folder. Prefer the deepest folder whose name
    // looks like a chapter (e.g. 第01话, 12, Chapter 3), including nested
    // layouts such as 漫画/第1卷/第01话/001.jpg.
    const folders = parts.slice(1, -1);
    const chapterPattern = /^(?:(?:第\s*)?\d+\s*(?:话|話|章|回|集|卷|册|部)|(?:chapter|ch)\s*[-_ ]*\d+|\d+)$/i;
    for (let i = folders.length - 1; i >= 0; i--) {
      if (chapterPattern.test(folders[i].trim())) return folders[i];
    }
    return folders.at(-1) || '未分章图片';
  }

  function updatePreviewSources() {
    const select = $('previewSource');
    if (!select) return;
    const oldValue = select.value;
    select.replaceChildren();
    const firstOption = document.createElement('option');
    firstOption.value = '';
    firstOption.textContent = tr('previewFirstItem');
    select.append(firstOption);

    const seen = new Set();
    for (const item of queue) {
      if (item.type !== 'image' || isRootCover(item.file)) continue;
      const chapter = imageChapterOf(item.file);
      if (seen.has(chapter)) continue;
      seen.add(chapter);
      const firstInChapter = queue.find(candidate => candidate.type === 'image' && !isRootCover(candidate.file) && imageChapterOf(candidate.file) === chapter);
      const option = document.createElement('option');
      option.value = firstInChapter ? fileKey(firstInChapter.file) : '';
      option.textContent = `${lang === 'en' ? 'Image chapter: ' : '图片章节：'}${chapter}`;
      select.append(option);
    }
    select.style.display = seen.size ? 'block' : 'none';
    if ([...select.options].some(option => option.value === oldValue)) select.value = oldValue;
    else select.value = '';
  }

  function updateGenerationFields() {
    const mode = $('outputMode').value;
    const hasImages = queue.some(item => item.type === 'image' && !isRootCover(item.file));
    const hasPdfs = queue.some(item => item.type === 'pdf');
    $('imageModeField').style.display = hasImages ? '' : 'none';
    $('pdfMergeField').style.display = hasPdfs && !$('chapterMode').checked ? '' : 'none';
    $('pdfChapterModeField').style.display = hasPdfs ? '' : 'none';
    $('rangeFields').style.display = hasImages && mode === 'range' ? 'flex' : 'none';
    $('batchFields').style.display = hasImages && mode === 'batch' ? 'flex' : 'none';
    updatePreviewSources();

    const imageItems = queue.filter(item => item.type === 'image' && !isRootCover(item.file));
    const chapters = [];
    for (const item of imageItems) {
      const name = imageChapterOf(item.file);
      if (!chapters.includes(name)) chapters.push(name);
    }
    for (const id of ['fromChapter', 'toChapter']) {
      const select = $(id);
      const oldValue = select.value;
      select.replaceChildren();
      chapters.forEach((name, index) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = `${index + 1}. ${name}`;
        select.append(option);
      });
      if (chapters.length) {
        select.value = chapters.includes(oldValue)
          ? oldValue
          : (id === 'fromChapter' ? chapters[0] : chapters[chapters.length - 1]);
      }
    }
  }

  function groupsOf(items) {
    const result = [];
    let cursor = 0;
    while (cursor < items.length) {
      const type = items[cursor].type || 'pdf';
      let end = cursor + 1;
      while (end < items.length && (items[end].type || 'pdf') === type) end++;
      const section = items.slice(cursor, end);

      if (type === 'pdf') {
        if (!$('chapterMode').checked) {
          const count = Math.max(1, Number($('mergeCount').value) || 1);
          for (let i = 0; i < section.length; i += count) result.push(section.slice(i, i + count));
        } else {
          const pdfGroups = [];
          for (const item of section) {
            const chapter = parseChapter(item.file);
            const lastGroup = pdfGroups.at(-1);
            const previous = lastGroup?.at(-1);
            const previousChapter = previous ? parseChapter(previous.file) : null;
            if (chapter && previousChapter && chapter.key === previousChapter.key && chapter.n === previousChapter.n + 1) lastGroup.push(item);
            else pdfGroups.push([item]);
          }
          result.push(...pdfGroups);
        }
      } else {
        const cover = section.find(item => isRootCover(item.file));
        const chapters = [];
        for (const item of section) {
          if (isRootCover(item.file)) continue;
          const chapterName = imageChapterOf(item.file);
          let last = chapters.at(-1);
          if (!last || last.name !== chapterName) {
            last = { name: chapterName, items: [] };
            chapters.push(last);
          }
          last.items.push(item);
        }

        let selected = chapters;
        const mode = $('outputMode').value;
        if (mode === 'range' && chapters.length) {
          let from = chapters.findIndex(ch => ch.name === $('fromChapter').value);
          let to = chapters.findIndex(ch => ch.name === $('toChapter').value);
          if (from < 0) from = 0;
          if (to < 0) to = chapters.length - 1;
          if (from > to) [from, to] = [to, from];
          selected = chapters.slice(from, to + 1);
        }

        let groups = [];
        if (mode === 'chapter') groups = selected.map(ch => ch.items);
        else if (mode === 'batch') {
          const count = Math.max(1, Number($('chaptersPerBook').value) || 5);
          for (let i = 0; i < selected.length; i += count) groups.push(selected.slice(i, i + count).flatMap(ch => ch.items));
        } else groups = selected.length ? [selected.flatMap(ch => ch.items)] : [];

        if (mode === 'merge' && $('includeCover').checked && cover && groups.length) groups[0].unshift(cover);
        result.push(...groups);
      }
      cursor = end;
    }
    return result;
  }

  function outputName(group, index) {
    const customTitle = $('title').value.trim();
    const extension = Number($('depth').value) === 2 ? '.xtch' : '.xtc';
    const isImages = group.every(item => item.type === 'image');

    if (isImages) {
      const chapters = [...new Set(group.filter(item => !isRootCover(item.file)).map(item => imageChapterOf(item.file)))];
      if (!chapters.length) chapters.push('封面');
      if (customTitle) {
        let first = 1;
        if ($('outputMode').value === 'batch') {
          first = index * Math.max(1, Number($('chaptersPerBook').value) || 5) + 1;
        } else if ($('outputMode').value === 'chapter') {
          first = index + 1;
        } else if ($('outputMode').value === 'range') {
          const allChapters = [...new Set(queue.filter(item => item.type === 'image' && !isRootCover(item.file)).map(item => imageChapterOf(item.file)))];
          const firstChapter = chapters[0];
          first = Math.max(1, allChapters.indexOf(firstChapter) + 1);
        }
        const last = first + chapters.length - 1;
        return safeName(chapters.length === 1
          ? `${customTitle}_${chapters[0]}`
          : `${customTitle}_${first}-${last}`) + extension;
      }
      return safeName(chapters.length === 1
        ? chapters[0]
        : `${chapters[0]}-${chapters.at(-1)}`) + extension;
    }

    const chapters = group.map(item => parseChapter(item.file));
    if ($('chapterMode').checked && chapters.every(Boolean)) {
      const first = chapters[0].n;
      const last = chapters.at(-1).n;
      const title = chapters[0].title;
      return safeName(`${first === last ? first : `${first}-${last}`}${title ? ' ' + title : ''}`) + extension;
    }
    if (customTitle) {
      // A single PDF should use the editable comic title exactly as entered.
      // Do not append the PDF's own trailing number (e.g. FlashLight 70 -> FlashLight 7070).
      if (group.length === 1) return safeName(customTitle) + extension;

      const numbers = group.map(item => {
        const match = item.file.name.match(/(\d+)(?!.*\d)/);
        return match ? Number(match[1]) : null;
      });
      const first = numbers[0] ?? index * Number($('mergeCount').value) + 1;
      const last = numbers.at(-1) ?? first + group.length - 1;
      const titleAlreadyEndsWithFirst = new RegExp(`(?:^|\\D)${first}$`).test(customTitle);
      const baseTitle = titleAlreadyEndsWithFirst ? customTitle.replace(new RegExp(`${first}$`), '').trim() : customTitle;
      return safeName(`${baseTitle || customTitle} ${first}-${last}`) + extension;
    }
    const stems = group.map(item => item.file.name.replace(/\.pdf$/i, ''));
    let name;
    if (stems.length === 1) name = stems[0];
    else {
      const matches = stems.map(stem => stem.match(/^(.*?)(\d+)$/));
      name = matches.every(Boolean) && matches.every(match => match[1] === matches[0][1])
        ? `${matches[0][1]}${matches[0][2]}-${matches.at(-1)[2]}`
        : `${stems[0]}_等${stems.length}个PDF`;
    }
    return safeName(name) + extension;
  }

  function clamp(value) {
    return Math.max(0, Math.min(255, value));
  }

  function contrastPixels(array, level) {
    if (!level) return;

    let min = 0;
    let max = 255;
    const histogram = new Uint32Array(256);

    for (const value of array) {
      histogram[Math.round(value)]++;
    }

    const length = array.length;
    const cut = level === 1 ? 0.003 : level === 2 ? 0.008 : 0.02;

    let count = 0;

    for (let index = 0; index < 256; index++) {
      count += histogram[index];

      if (count > length * cut) {
        min = index;
        break;
      }
    }

    count = 0;

    for (let index = 255; index >= 0; index--) {
      count += histogram[index];

      if (count > length * cut) {
        max = index;
        break;
      }
    }

    if (max > min) {
      for (let index = 0; index < array.length; index++) {
        array[index] = clamp(
          (array[index] - min) * 255 / (max - min)
        );
      }
    }
  }

  function quant(value, depth, threshold) {
    if (depth === 1) return value < threshold ? 0 : 255;

    return value < 42 ? 0
      : value < 127 ? 85
      : value < 212 ? 170
      : 255;
  }

  function processGray(
    gray,
    mode,
    depth,
    threshold,
    contrast,
    brightness,
    strength
  ) {
    const array = new Float32Array(gray.length);

    for (let index = 0; index < array.length; index++) {
      array[index] = clamp(gray[index] + brightness * 1.5);
    }

    contrastPixels(array, contrast);

    if (mode === 'none' || strength === 0) {
      return Uint8Array.from(
        array,
        value => quant(value, depth, threshold)
      );
    }

    const output = new Uint8Array(array.length);
    const work = new Float32Array(array);
    const scale = strength / 100;

    function add(x, y, error) {
      if (x >= 0 && x < W && y >= 0 && y < H) {
        work[y * W + x] += error * scale;
      }
    }

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const index = y * W + x;
        const old = clamp(work[index]);
        const value = quant(old, depth, 128);

        output[index] = value;

        const error = old - value;

        if (mode === 'atkinson') {
          add(x + 1, y, error / 8);
          add(x + 2, y, error / 8);
          add(x - 1, y + 1, error / 8);
          add(x, y + 1, error / 8);
          add(x + 1, y + 1, error / 8);
          add(x, y + 2, error / 8);
        } else if (mode === 'stucki') {
          [
            [1, 0, 8], [2, 0, 4],
            [-2, 1, 2], [-1, 1, 4], [0, 1, 8],
            [1, 1, 4], [2, 1, 2],
            [-2, 2, 1], [-1, 2, 2], [0, 2, 4],
            [1, 2, 2], [2, 2, 1]
          ].forEach(([dx, dy, weight]) => {
            add(x + dx, y + dy, error * weight / 42);
          });
        } else {
          add(x + 1, y, error * 7 / 16);
          add(x - 1, y + 1, error * 3 / 16);
          add(x, y + 1, error * 5 / 16);
          add(x + 1, y + 1, error / 16);
        }
      }
    }

    return output;
  }

  function md5(input) {
    const K = new Uint32Array(64);
    const S = [
      7, 12, 17, 22, 5, 9, 14, 20,
      4, 11, 16, 23, 6, 10, 15, 21
    ];

    for (let i = 0; i < 64; i++) {
      K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
    }

    const length = input.length;
    const bitLength = length * 8;
    const total = ((length + 9 + 63) >> 6) << 6;
    const message = new Uint8Array(total);

    message.set(input);
    message[length] = 128;

    const view = new DataView(message.buffer);
    view.setUint32(total - 8, bitLength >>> 0, true);
    view.setUint32(
      total - 4,
      Math.floor(bitLength / 4294967296),
      true
    );

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    for (let offset = 0; offset < total; offset += 64) {
      const words = new Uint32Array(16);
      const block = new DataView(message.buffer, offset, 64);

      for (let i = 0; i < 16; i++) {
        words[i] = block.getUint32(i * 4, true);
      }

      let a = a0;
      let b = b0;
      let c = c0;
      let d = d0;

      for (let i = 0; i < 64; i++) {
        let f;
        let g;

        if (i < 16) {
          f = (b & c) | (~b & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | (~d & c);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3 * i + 5) % 16;
        } else {
          f = c ^ (b | ~d);
          g = (7 * i) % 16;
        }

        const shift = S[
          i < 16 ? i % 4
            : i < 32 ? 4 + i % 4
            : i < 48 ? 8 + i % 4
            : 12 + i % 4
        ];

        const z = (a + f + K[i] + words[g]) | 0;
        const rotated = (z << shift) | (z >>> (32 - shift));

        a = d;
        d = c;
        c = b;
        b = (b + rotated) | 0;
      }

      a0 = (a0 + a) | 0;
      b0 = (b0 + b) | 0;
      c0 = (c0 + c) | 0;
      d0 = (d0 + d) | 0;
    }

    const output = new Uint8Array(16);
    const outputView = new DataView(output.buffer);

    [a0, b0, c0, d0].forEach((value, index) => {
      outputView.setUint32(index * 4, value, true);
    });

    return output;
  }

  function makePage(magic, width, height, data) {
    const output = new Uint8Array(22 + data.length);
    const view = new DataView(output.buffer);

    for (let i = 0; i < 4; i++) {
      output[i] = magic.charCodeAt(i);
    }

    view.setUint16(4, width, true);
    view.setUint16(6, height, true);
    view.setUint32(10, data.length, true);
    output.set(data, 22);
    output.set(md5(data).slice(0, 8), 14);

    return output;
  }

  function packPage(pixels, depth) {
    if (depth === 1) {
      const rowBytes = Math.ceil(W / 8);
      const data = new Uint8Array(rowBytes * H);

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (pixels[y * W + x] >= 128) {
            data[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7);
          }
        }
      }

      return makePage('XTG\0', W, H, data);
    }

    const columnBytes = Math.ceil(H / 8);
    const plane = columnBytes * W;
    const plane0 = new Uint8Array(plane);
    const plane1 = new Uint8Array(plane);

    for (let x = 0; x < W; x++) {
      const offset = (W - 1 - x) * columnBytes;

      for (let y = 0; y < H; y++) {
        const pixel = pixels[y * W + x];
        const value = pixel >= 212 ? 0
          : pixel >= 127 ? 1
          : pixel >= 42 ? 2
          : 3;

        const index = offset + (y >> 3);
        const bit = 7 - (y & 7);

        if (value & 1) plane0[index] |= 1 << bit;
        if (value & 2) plane1[index] |= 1 << bit;
      }
    }

    const data = new Uint8Array(plane * 2);
    data.set(plane0);
    data.set(plane1, plane);

    return makePage('XTH\0', W, H, data);
  }

  function buildBook(pages, is2, title) {
    const metaOffset = 56;
    const indexOffset = 312;
    const dataOffset = indexOffset + pages.length * 16;
    const total = dataOffset +
      pages.reduce((sum, page) => sum + page.length, 0);

    const output = new Uint8Array(total);
    const view = new DataView(output.buffer);
    const magic = is2 ? 'XTCH' : 'XTC\0';

    for (let i = 0; i < 4; i++) {
      output[i] = magic.charCodeAt(i);
    }

    view.setUint16(4, 1, true);
    view.setUint16(6, pages.length, true);
    view.setUint32(8, 0x01000100, true);
    view.setUint32(12, 1, true);
    view.setBigUint64(16, BigInt(metaOffset), true);
    view.setBigUint64(24, BigInt(indexOffset), true);
    view.setBigUint64(32, BigInt(dataOffset), true);
    view.setBigUint64(40, 0n, true);
    view.setBigUint64(48, 0n, true);

    new TextEncoder().encode(title).slice(0, 127).forEach((byte, index) => {
      output[metaOffset + index] = byte;
    });

    let position = dataOffset;

    pages.forEach((page, index) => {
      const entry = indexOffset + index * 16;

      view.setBigUint64(entry, BigInt(position), true);
      view.setUint32(entry + 8, page.length, true);
      view.setUint16(entry + 12, W, true);
      view.setUint16(entry + 14, H, true);

      output.set(page, position);
      position += page.length;
    });

    return output;
  }

  // Continuously stitch scaled PDF pages into 528 × 792 output pages.
  // Overlap is fixed at 0%; only the final partial page is white-padded.
  function createStitcher() {
    function newWhitePage() {
      const page = new Uint8Array(W * H);
      page.fill(255);
      return page;
    }

    let buffer = newWhitePage();
    let usedRows = 0;

    function appendCanvas(sourceCanvas, onPage, maxPages = Infinity) {
      if (!sourceCanvas.width || !sourceCanvas.height) {
        throw Error('源页面尺寸无效。');
      }

      if (typeof onPage !== 'function') {
        throw Error('拼接输出回调无效。');
      }

      const scaleX = W / sourceCanvas.width;
      const scaledHeight = Math.max(
        1,
        Math.ceil(sourceCanvas.height * scaleX)
      );
      // Use the rounded target height as the global vertical scale so adjacent
      // tiles map to the same row coordinates without gaps.
      const scaleY = scaledHeight / sourceCanvas.height;

      // A two-row bleed above and below each tile avoids visible seams caused
      // by interpolation at crop boundaries. Memory remains bounded (~794 rows).
      const temp = document.createElement('canvas');
      temp.width = W;
      temp.height = H + 2;

      const context = temp.getContext('2d', {
        willReadFrequently: true
      });

      if (!context) {
        temp.width = 1;
        temp.height = 1;
        throw Error('无法创建拼接画布上下文。');
      }

      let sourceRow = 0;
      let emitted = 0;

      try {
        while (sourceRow < scaledHeight && emitted < maxPages) {
          const rows = Math.min(
            H,
            scaledHeight - sourceRow,
            H - usedRows
          );

          if (rows <= 0) {
            throw Error('拼接过程遇到无效的行数。');
          }

          // Include one output row of bleed on each side where available.
          const tileStart = Math.max(0, sourceRow - 1);
          const tileEnd = Math.min(scaledHeight, sourceRow + rows + 1);
          const tileRows = tileEnd - tileStart;
          const tileOrigin = sourceRow - 1;
          const destY = tileStart - tileOrigin;
          const sourceY = tileStart / scaleY;
          const sourceHeight = (tileEnd - tileStart) / scaleY;

          context.fillStyle = '#fff';
          context.fillRect(0, 0, W, temp.height);
          context.drawImage(
            sourceCanvas,
            0, sourceY,
            sourceCanvas.width, sourceHeight,
            0, destY,
            W, tileRows
          );

          // The requested source rows begin one row into the temporary tile.
          const rgba = context.getImageData(0, 1, W, rows).data;

          for (let y = 0; y < rows; y++) {
            const sourceOffset = y * W * 4;
            const targetOffset = (usedRows + y) * W;

            for (let x = 0; x < W; x++) {
              const pixel = sourceOffset + x * 4;
              buffer[targetOffset + x] = Math.round(
                0.299 * rgba[pixel] +
                0.587 * rgba[pixel + 1] +
                0.114 * rgba[pixel + 2]
              );
            }
          }

          sourceRow += rows;
          usedRows += rows;

          if (usedRows === H) {
            const completePage = buffer;
            buffer = newWhitePage();
            usedRows = 0;
            emitted++;
            onPage(completePage);
          }
        }
      } finally {
        temp.width = 1;
        temp.height = 1;
      }

      return {
        pagesEmitted: emitted,
        remainingRows: sourceRow < scaledHeight
      };
    }

    function finish(onPage) {
      if (usedRows === 0) return false;
      if (typeof onPage !== 'function') {
        throw Error('拼接输出回调无效。');
      }

      // The buffer was initialized white, so remaining rows are padded at bottom.
      const lastPage = buffer;
      buffer = newWhitePage();
      usedRows = 0;
      onPage(lastPage);
      return true;
    }

    return { appendCanvas, finish };
  }

  function settings() {
    return {
      depth: Number($('depth').value),
      mode: $('dither').value,
      threshold: Number($('threshold').value),
      contrast: Number($('contrast').value),
      brightness: Number($('brightness').value),
      maskMode: $('maskMode').checked,
      strength: Number($('strength').value)
    };
  }

  function paintPreview(gray) {
    const current = settings();
    const pixels = processGray(
      gray,
      current.mode,
      current.depth,
      current.threshold,
      current.contrast,
      current.brightness,
      current.strength
    );

    const canvas = $('preview');
    const context = canvas.getContext('2d');
    const imageData = context.createImageData(W, H);

    for (let i = 0, j = 0; i < pixels.length; i++, j += 4) {
      imageData.data[j] = pixels[i];
      imageData.data[j + 1] = pixels[i];
      imageData.data[j + 2] = pixels[i];
      imageData.data[j + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);
    canvas.classList.add('has-preview');
  }

  function clearPreviewCanvas() {
    const canvas = $('preview');
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.remove('has-preview');
  }

  function updatePageLabel() {
    const count = previewPages.length;

    $('pageLabel').textContent = lang === 'en'
      ? `Page ${count ? previewIndex + 1 : 0} / ${count}`
      : `第 ${count ? previewIndex + 1 : 0} / ${count} 页`;

    $('prev').disabled = !count || previewIndex <= 0;
    $('next').disabled = !count || previewIndex >= count - 1;
  }

  async function loadPreview() {
    const requestId = ++previewRequestId;

    try {
      const selectedPreviewKey = $('previewSource')?.value || '';
      const selectedPreviewItem = selectedPreviewKey
        ? queue.find(item => fileKey(item.file) === selectedPreviewKey)
        : null;
      const firstItem = selectedPreviewItem || queue[0] || null;
      const file = firstItem?.file;

      if (!file) {
        previewKey = '';
        previewPages = [];
        previewIndex = 0;

        if (previewPdf) {
          await previewPdf.destroy();
          previewPdf = null;
        }

        clearPreviewCanvas();
        updatePageLabel();
        return;
      }

      const key = fileKey(file);

      if (firstItem.type === 'image') {
        const chapterName = imageChapterOf(file);
        if (key !== previewKey || !previewPages.length) {
          const newPages = [];
          const stitcher = createStitcher();
          const chapterItems = queue.filter(item =>
            item.type === 'image' && imageChapterOf(item.file) === chapterName
          );
          for (const item of chapterItems) {
            if (requestId !== previewRequestId) return;
            if (newPages.length >= 5) break;
            const canvas = await imageFileToCanvas(item.file);
            try {
              stitcher.appendCanvas(canvas, gray => newPages.push(gray), 5 - newPages.length);
            } finally {
              canvas.width = 1;
              canvas.height = 1;
            }
            await new Promise(resolve => setTimeout(resolve, 0));
          }
          if (newPages.length < 5) stitcher.finish(gray => newPages.push(gray));
          if (requestId !== previewRequestId) return;
          if (previewPdf) {
            await previewPdf.destroy();
            previewPdf = null;
          }
          previewPages = newPages.slice(0, 5);
          previewIndex = 0;
          previewKey = key;
        }
        if (requestId !== previewRequestId) return;
        if (previewPages.length) paintPreview(previewPages[previewIndex]);
        else clearPreviewCanvas();
        updatePageLabel();
        return;
      }

      if (!pdfjsLib) {
        throw Error(
          tr('pdfjsFailed') +
          (pdfjsLoadError?.message
            ? ' ' + pdfjsLoadError.message
            : '')
        );
      }


      if (key !== previewKey || !previewPages.length) {
        const task = pdfjsLib.getDocument({
          data: await file.arrayBuffer()
        });
        const newPdf = await task.promise;
        const newPages = [];
        const stitcher = createStitcher();

        try {
          for (
            let number = 1;
            number <= newPdf.numPages && newPages.length < 5;
            number++
          ) {
            if (requestId !== previewRequestId) {
              await newPdf.destroy();
              return;
            }

            const page = await newPdf.getPage(number);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);

            const context = canvas.getContext('2d', {
              willReadFrequently: true
            });

            if (!context) {
              throw Error('无法创建预览画布上下文。');
            }

            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);

            await page.render({
              canvasContext: context,
              viewport,
              background: 'rgb(255,255,255)',
              intent: $('maskMode').checked ? 'print' : 'display'
            }).promise;

            if (requestId !== previewRequestId) {
              canvas.width = 1;
              canvas.height = 1;
              await newPdf.destroy();
              return;
            }

            const result = stitcher.appendCanvas(
              canvas,
              gray => newPages.push(gray),
              5 - newPages.length
            );

            page.cleanup?.();
            canvas.width = 1;
            canvas.height = 1;

            if (result.remainingRows) break;
          }

          if (newPages.length < 5) {
            stitcher.finish(gray => newPages.push(gray));
          }

          if (requestId !== previewRequestId) {
            await newPdf.destroy();
            return;
          }

          if (previewPdf) {
            await previewPdf.destroy();
          }

          previewPdf = newPdf;
          previewPages = newPages.slice(0, 5);
          previewIndex = 0;
          previewKey = key;
        } catch (error) {
          await newPdf.destroy();

          if (requestId === previewRequestId) {
            previewKey = '';
            previewPages = [];
            previewIndex = 0;
          }

          throw error;
        }
      }

      if (requestId !== previewRequestId) return;

      if (previewPages.length) {
        paintPreview(previewPages[previewIndex]);
      } else {
        clearPreviewCanvas();
      }

      updatePageLabel();
    } catch (error) {
      if (requestId !== previewRequestId) return;

      console.error('Preview failed:', error);
      status(
        tr('previewFailed') +
        (error.message || String(error)),
        0
      );
      updatePageLabel();
    }
  }

  $('previewSource').addEventListener('change', () => {
    previewKey = '';
    previewPages = [];
    previewIndex = 0;
    loadPreview();
  });

  ['outputMode', 'chaptersPerBook', 'fromChapter', 'toChapter', 'includeCover', 'chapterMode'].forEach(id => {
    $(id).addEventListener('change', () => {
      updateGenerationFields();
      previewKey = '';
      loadPreview();
    });
  });

  $('prev').onclick = () => {
    previewIndex = Math.max(0, previewIndex - 1);

    if (previewPages[previewIndex]) {
      paintPreview(previewPages[previewIndex]);
    }

    updatePageLabel();
  };

  $('next').onclick = () => {
    previewIndex = Math.min(
      previewPages.length - 1,
      previewIndex + 1
    );

    if (previewPages[previewIndex]) {
      paintPreview(previewPages[previewIndex]);
    }

    updatePageLabel();
  };

    [
    'depth', 'dither', 'threshold',
    'contrast', 'brightness', 'strength', 'maskMode'
  ].forEach(id => {
    $(id).addEventListener('input', () => {
      for (const [inputId, outputId] of [
        ['threshold', 'thresholdValue'],
        ['brightness', 'brightnessValue'],
        ['strength', 'strengthValue']
      ]) {
        const output = $(outputId);

        if (output) {
          output.textContent =
            $(inputId).value +
            (inputId === 'strength' ? '%' : '');
        }
      }

      // 蒙版模式改变时，必须重新渲染 PDF，而不是只刷新旧预览
      if (id === 'maskMode') {
        previewKey = '';
        previewPages = [];
        previewIndex = 0;
        loadPreview();
        return;
      }

      if (previewPages[previewIndex]) {
        paintPreview(previewPages[previewIndex]);
      }
    });
  });
      for (const [inputId, outputId] of [
        ['threshold', 'thresholdValue'],
        ['brightness', 'brightnessValue'],
        ['strength', 'strengthValue']
      ]) {
        const output = $(outputId);

        if (output) {
          output.textContent =
            $(inputId).value +
            (inputId === 'strength' ? '%' : '');
        }
      }

      if (previewPages[previewIndex]) {
        paintPreview(previewPages[previewIndex]);
      }
    });
  });

  async function imageFileToCanvas(file) {
    const canvas = document.createElement('canvas');
    const contextOptions = { willReadFrequently: true };
    let bitmap = null;

    try {
      if (window.createImageBitmap) {
        try {
          bitmap = await createImageBitmap(file);
          if (bitmap.width && bitmap.height) {
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const context = canvas.getContext('2d', contextOptions);
            if (!context) throw Error('无法创建图片画布上下文。');
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(bitmap, 0, 0);
            return canvas;
          }
        } catch (bitmapError) {
          console.warn('createImageBitmap failed; falling back to HTMLImageElement:', file.name, bitmapError);
        } finally {
          bitmap?.close?.();
          bitmap = null;
        }
      }

      const url = URL.createObjectURL(file);
      try {
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
        if (img.decode) await img.decode();
        else await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(Error('图片解码失败：' + file.name));
        });
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (!width || !height) throw Error('图片尺寸无效：' + file.name);
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', contextOptions);
        if (!context) throw Error('无法创建图片画布上下文。');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      } finally {
        URL.revokeObjectURL(url);
      }
      return canvas;
    } catch (error) {
      canvas.width = 1;
      canvas.height = 1;
      throw error;
    } finally {
      bitmap?.close?.();
    }
  }

  async function convertGroup(group, groupIndex, total) {
    const current = settings();
    const pages = [];
    let pageTotal = 0;
    const isImages = group.every(item => item.type === 'image');
    const stitcher = createStitcher();

    function addOutputGray(gray) {
      const processed = processGray(
        gray, current.mode, current.depth, current.threshold,
        current.contrast, current.brightness, current.strength
      );
      pages.push(packPage(processed, current.depth));
      pageTotal++;
    }

    function updateProgress(file, fileIndex, pageNumber, pageCount, label) {
      status(
        `${tr('convertingGroup')} ${groupIndex + 1}/${total} · ${file.name} · ` +
        `${label} ${pageNumber}/${pageCount} · ${tr('x3Page')} ${pageTotal}`,
        ((groupIndex + (fileIndex + pageNumber / Math.max(1, pageCount)) / group.length) / total) * 100
      );
    }

    for (let fileIndex = 0; fileIndex < group.length; fileIndex++) {
      if (cancelled) throw Error('Cancelled');
      const item = group[fileIndex];
      item.state = 'converting';
      renderQueue();

      if (item.type === 'image') {
        const canvas = await imageFileToCanvas(item.file);
        try {
          stitcher.appendCanvas(canvas, gray => {
            if (cancelled) throw Error('Cancelled');
            addOutputGray(gray);
            updateProgress(item.file, fileIndex, 1, 1, lang === 'en' ? 'Image' : '图片');
          });
        } finally {
          canvas.width = 1;
          canvas.height = 1;
        }
        item.state = 'done';
        renderQueue();
        updateProgress(item.file, fileIndex, 1, 1, lang === 'en' ? 'Image' : '图片');
        await new Promise(resolve => setTimeout(resolve, 0));
        continue;
      }

      if (!pdfjsLib) {
        throw Error(tr('pdfjsFailed') + (pdfjsLoadError?.message ? ' ' + pdfjsLoadError.message : ''));
      }
      const pdf = await pdfjsLib.getDocument({ data: await item.file.arrayBuffer() }).promise;
      try {
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          if (cancelled) throw Error('Cancelled');
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (!context) throw Error('无法创建转换画布上下文。');
          context.fillStyle = '#fff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({
            canvasContext: context,
            viewport,
            background: 'rgb(255,255,255)',
            intent: current.maskMode ? 'print' : 'display'
          }).promise;
          stitcher.appendCanvas(canvas, gray => {
            if (cancelled) throw Error('Cancelled');
            addOutputGray(gray);
            updateProgress(item.file, fileIndex, pageNumber, pdf.numPages, tr('pdfPage'));
          });
          page.cleanup?.();
          canvas.width = 1;
          canvas.height = 1;
          updateProgress(item.file, fileIndex, pageNumber, pdf.numPages, tr('pdfPage'));
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      } finally {
        await pdf.destroy();
      }
      item.state = 'done';
      renderQueue();
    }

    stitcher.finish(gray => addOutputGray(gray));
    const name = outputName(group, groupIndex);
    const data = buildBook(pages, current.depth === 2, name.replace(/\.(xtc|xtch)$/i, ''));
    status(
      `${tr('convertingGroup')} ${groupIndex + 1}/${total} · ${tr('x3Page')} ${pageTotal}`,
      ((groupIndex + 1) / total) * 100
    );

    return {
      name,
      blob: new Blob([data], { type: 'application/octet-stream' }),
      files: group.length,
      type: isImages ? 'image' : 'pdf',
      pages: pageTotal,
      folderPath: isImages ? [] : sourceFolderPath(group)
    };
  }

  async function getUniqueFileName(directory, baseName, usedNames) {
    let candidate = baseName;
    let number = 2;

    while (
      usedNames.has(candidate.toLowerCase()) ||
      await fileExists(directory, candidate)
    ) {
      candidate = baseName.replace(
        /(\.[^.]+)$/i,
        ` (${number++})$1`
      );
    }

    usedNames.add(candidate.toLowerCase());
    return candidate;
  }

  async function fileExists(directory, name) {
    try {
      await directory.getFileHandle(name);
      return true;
    } catch (error) {
      if (error.name === 'NotFoundError') return false;
      throw error;
    }
  }

  async function saveOutputToFolder(output) {
    if (!outputDirectoryHandle) {
      throw Error(tr('needFolder'));
    }

    let directory = outputDirectoryHandle;

    for (const part of output.folderPath || []) {
      directory = await directory.getDirectoryHandle(
        safeName(part),
        { create: true }
      );
    }

    if (!saveOutputToFolder.usedNames) {
      saveOutputToFolder.usedNames = new Map();
    }

    const key = (output.folderPath || []).join('/').toLowerCase();

    if (!saveOutputToFolder.usedNames.has(key)) {
      saveOutputToFolder.usedNames.set(key, new Set());
    }

    const usedNames = saveOutputToFolder.usedNames.get(key);
    const finalName = await getUniqueFileName(
      directory,
      output.name,
      usedNames
    );

    const fileHandle = await directory.getFileHandle(
      finalName,
      { create: true }
    );

    const writable = await fileHandle.createWritable();

    try {
      await writable.write(output.blob);
    } finally {
      await writable.close();
    }

    return finalName;
  }

  async function chooseOutputFolder() {
    if (running || savingFolder) return false;

    if (!window.showDirectoryPicker) {
      status(tr('noFolderSupport'), 0);
      return false;
    }

    try {
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      outputDirectoryHandle = handle;

      if (saveOutputToFolder.usedNames) {
        saveOutputToFolder.usedNames.clear();
      }

      updateFolderStatus();
      status(tr('folderReady') + handle.name, 0);
      return true;
    } catch (error) {
      if (error.name === 'AbortError') {
        status(tr('folderCancelled'), 0);
      } else {
        status(tr('folderSaveFailed') + error.message, 0);
      }

      return false;
    }
  }
  async function createAndDownloadZip() {
    if (!window.JSZip) {
      throw Error(
        lang === 'en'
          ? 'JSZip failed to load. Check your network and refresh.'
          : 'JSZip 加载失败，请检查网络后刷新。'
      );
    }

    if (!outputs.length) return;

    const zip = new window.JSZip();
    const used = new Set();

    for (const output of outputs) {
      const folder = (output.folderPath || []).join('/');
      const original = folder
        ? `${folder}/${output.name}`
        : output.name;

      let name = original;
      let number = 2;

      while (used.has(name.toLowerCase())) {
        name = original.replace(
          /(\.[^.]+)$/i,
          ` (${number++})$1`
        );
      }

      used.add(name.toLowerCase());
      zip.file(name, output.blob);
    }

    status(tr('zipBuilding'), 0);

    const blob = await zip.generateAsync(
      {
        type: 'blob',
        compression: 'STORE'
      },
      metadata => {
        $('bar').style.width = metadata.percent + '%';
      }
    );

    download(blob, 'X3-original-style-test-results.zip');

    status(
      tr('zipReady') + outputs.length + ' ' + tr('zipUnit'),
      100
    );
  }

  $('go').onclick = async () => {
    if (running || !queue.length) return;

    const mode = selectedDownloadMode();

    // If folder mode is selected, open the folder picker from the button click.
    if (mode === 'folder' && !outputDirectoryHandle) {
      const selected = await chooseOutputFolder();

      if (!selected || !outputDirectoryHandle) {
        return;
      }
    }

    if (mode === 'folder' && !window.showDirectoryPicker) {
      status(tr('noFolderSupport'), 0);
      return;
    }

    const pendingItems = queue.filter(item =>
      item.state === 'waiting' || item.state === 'failed'
    );
    if (!pdfjsLib && pendingItems.some(item => item.type !== 'image')) {
      status(
        tr('pdfjsFailed') +
        (pdfjsLoadError?.message ? ' ' + pdfjsLoadError.message : ''),
        0
      );
      return;
    }

    running = true;
    cancelled = false;

    if (saveOutputToFolder.usedNames) {
      saveOutputToFolder.usedNames.clear();
    }

    renderQueue();
    renderOutputs();

    const todo = queue.filter(item =>
      item.state === 'waiting' || item.state === 'failed'
    );

    const groups = groupsOf(todo);
    let done = 0;
    let failed = 0;
    let saved = 0;
    let saveFailed = 0;

    try {
      for (let index = 0; index < groups.length; index++) {
        if (cancelled) break;

        try {
          const output = await convertGroup(
            groups[index],
            index,
            groups.length
          );

          outputs.push(output);
          done++;

          // Folder mode writes each book immediately after conversion.
          if (mode === 'folder' && !cancelled) {
            try {
              const finalName = await saveOutputToFolder(output);
              saved++;

              status(
                tr('folderSaved') + finalName,
                ((index + 1) / groups.length) * 100
              );
            } catch (error) {
              saveFailed++;
              console.error('Folder save failed:', error);

              status(
                tr('saveFailed') + output.name + ' — ' + error.message,
                ((index + 1) / groups.length) * 100
              );
            }
          }

          renderOutputs();
        } catch (error) {
          if (error.message === 'Cancelled') {
            cancelled = true;
            break;
          }

          failed++;

          for (const item of groups[index]) {
            item.state = 'failed';
          }

          console.error(error);
          status(tr('conversionFailed') + error.message);
        }

        renderQueue();
      }

      // ZIP mode creates the ZIP automatically after conversion finishes.
      if (mode === 'zip' && !cancelled && outputs.length) {
        try {
          await createAndDownloadZip();
        } catch (error) {
          console.error(error);
          status(tr('autoZipFailed') + error.message);
        }
      }
    } finally {
      running = false;
      renderQueue();
      renderOutputs();
    }

    if (cancelled) {
      status(
        `${tr('cancelled')}${done}${tr('successUnit')}${failed}${tr('groupUnit')}`,
        100
      );
    } else if (mode === 'folder') {
      let message =
        `${lang === 'en' ? 'Finished. Converted ' : '转换结束。成功转换 '}` +
        `${done}${lang === 'en' ? ', failed ' : ' 组，转换失败 '}` +
        `${failed}${tr('groupUnit')}`;

      message += lang === 'en'
        ? ` Saved ${saved}; save failures ${saveFailed}.`
        : ` 已保存 ${saved} 本；保存失败 ${saveFailed} 本。`;

      status(message, 100);
    } else {
      status(
        `${tr('finished')}${done}${tr('successUnit')}${failed}${tr('groupUnit')}`,
        100
      );
    }
  };

  $('cancel').onclick = () => {
    cancelled = true;
    status(tr('cancelRequested'));
  };

  $('clear').onclick = () => {
    if (running) return;

    queue = [];
    outputs = [];
    $('title').value = '';
    titleWasEdited = false;
    expandedQueueGroups.clear();
    previewPages = [];
    previewRequestId++;

    if (previewPdf) {
      previewPdf.destroy();
      previewPdf = null;
    }

    previewKey = '';
    previewIndex = 0;

    if (saveOutputToFolder.usedNames) {
      saveOutputToFolder.usedNames.clear();
    }

    renderQueue();
    renderOutputs();
    updateGenerationFields();

    $('bar').style.width = '0';
    status(tr('cleared'), 0);
    loadPreview();
  };

  $('zip').onclick = async () => {
    if (running || savingFolder || !outputs.length) return;

    try {
      await createAndDownloadZip();
    } catch (error) {
      console.error(error);
      status(tr('autoZipFailed') + error.message, 0);
    }
  };

  // Initialise labels and controls.
  renderQueue();
  renderOutputs();
  updateGenerationFields();
  applyLang();
  updatePageLabel();

  if (pdfjsLoadError) {
    status(
      tr('pdfjsFailed') + ' ' +
      (pdfjsLoadError.message || String(pdfjsLoadError)),
      0
    );
  }
})();
