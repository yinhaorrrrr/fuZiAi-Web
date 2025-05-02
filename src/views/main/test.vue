<!-- PdfViewer.vue -->
<template>
  <div class="pdf-viewer">
    <!-- PDF 文件的链接放在 pdfUrl 变量中，也可直接写在 :pdf 属性内 -->
    <VuePdfApp :pdf="pdfUrl" :config="viewerConfig" style="height: 100vh;" />
  </div>
</template>

<script setup>
import VuePdfApp from 'vue3-pdf-app';
import 'vue3-pdf-app/dist/icons/main.css';

// PDF 链接：可以替换成实际的 PDF 地址
const pdfUrl = 'https://example.com/sample.pdf';

// 配置项仅保留了必要的功能：页码、缩放、打印、下载以及内置侧边栏预览（点击侧边栏按钮可收起/展开）
const viewerConfig = {
  toolbar: {
    // 左侧仅显示页码输入框（上一页、下一页可通过侧边栏内置按钮或键盘操作实现）
    toolbarViewerLeft: {
      previous: false,
      next: false,
      pageNumber: true,
    },
    // 中间保留缩放操作
    toolbarViewerMiddle: {
      zoomOut: true,
      zoomIn: true,
      scaleSelectContainer: false,
    },
    // 右侧仅保留打印和下载功能
    toolbarViewerRight: {
      print: true,
      download: true,
    },
  },
  // 内置侧边栏设置：只启用缩略图预览，其他功能禁用
  sidebar: {
    viewThumbnail: true,
    viewOutline: false,
    viewAttachments: false,
  },
  errorWrapper: false,
};
</script>

<style scoped>
.pdf-app.dark {
  --pdf-app-background-color: #ffffff;
  --pdf-toolbar-color: #f8faf8;
  --pdf-toolbar-border-color: #e0f0e0;
  --pdf-toolbar-font-color: #4a6b4a;
  --pdf-button-hover-font-color: #2e8b57;
  --pdf-button-hover-background: #e8f5e9;
  --pdf-page-number-border: 1px solid #c8e6c9;
  --pdf-page-number-focus-shadow: 0 0 0 2px rgba(46, 139, 87, 0.2);
  --pdf-sidebar-color: #f1f8f1;
  --pdf-sidebar-border-color: #d0e9d0;
}

/* 添加平滑过渡效果 */
:deep(.pdf-app button) {
  transition: all 0.2s ease-in-out;
}

/* 调整工具栏高度和间距 */
:deep(.pdf-app .toolbar) {
  padding: 8px 16px;
  height: 48px;
}

</style>
