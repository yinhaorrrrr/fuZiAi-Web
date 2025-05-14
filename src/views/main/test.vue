<!-- PdfViewer.vue -->
<template>
  <div class="background-layer"></div>
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
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #c3e4ff 0%, #e3f5ff 100%);
  background: #60aff6;
  background: -webkit-linear-gradient(225deg, #60aff6 0%, #c7f9c6 100%);
  background: linear-gradient(225deg, #60aff6 0%, #c7f9c6 100%);
  z-index: -1;
}
</style>
