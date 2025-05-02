<!-- PdfViewer.vue -->
<template>
  <div class="pdf-viewer">
    <VuePdfApp :pdf="pdfUrl" :config="viewerConfig" style="height: 80vh;" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import VuePdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'

// ✅ 接收父组件传入的 PDF 链接
const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
})

// ✅ PDF 工具栏与侧边栏配置
const viewerConfig = {
  toolbar: {
    toolbarViewerLeft: {
      previous: false,
      next: false,
      pageNumber: true
    },
    toolbarViewerMiddle: {
      zoomOut: true,
      zoomIn: true,
      scaleSelectContainer: false
    },
    toolbarViewerRight: {
      print: true,
      download: true
    }
  },
  sidebar: {
    viewThumbnail: true,
    viewOutline: false,
    viewAttachments: false
  },
  errorWrapper: false
}
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
}

:deep(.pdf-app) {
  display: flex;
  height: 100%;
}

/* 固定侧边栏宽度 */
:deep(#sidebarContainer) {
  width: 260px !important;
  min-width: 260px !important;
  max-width: 260px !important;
  flex-shrink: 0 !important;
}

/* 隐藏可拖动条 */
:deep(#sidebarResizer) {
  display: none !important;
}

/* 内容区域自适应 */
:deep(#viewerContainer) {
  flex: 1;
  overflow: auto;
}


:deep(.pdf-app button) {
  transition: all 0.2s ease-in-out;
}

:deep(.pdf-app .toolbar) {
  padding: 8px 16px;
  height: 48px;
}
</style>