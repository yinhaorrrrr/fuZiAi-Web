<template>
  <div class="course-detail-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-loading="loading">
      <div v-if="courseDetail">
        <!-- 课程头图 -->
        <el-image :src="courseDetail.imageUrl" fit="cover" class="course-banner" />

        <!-- 课程基本信息 -->
        <div class="course-base-info">
          <h1 class="course-title">{{ courseDetail.title }}</h1>
          <div class="meta-info">
            <span class="difficulty">难度：{{ courseDetail.difficulty }}</span>
            <el-tag
                v-for="tag in courseDetail.tagList"
                :key="tag.id"
                type="success"
                size="default"
                class="tag"
                effect="dark"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>

        <!-- 课程介绍 -->
        <el-card class="course-description">
          <h2>课程介绍</h2>
          <div v-html="courseDetail.description"></div>
        </el-card>

        <!-- 课程章节 -->
        <el-card class="lesson-list">
          <h2>课程章节</h2>
          <div class="lesson-items">
            <div
                v-for="(lesson, index) in courseDetail.lessonList"
                :key="lesson.id"
                class="lesson-item"
            >
              <div class="lesson-header">
                <span class="index">第{{ index + 1 }}章</span>
                <span class="title">{{ lesson.title }}</span>
                <el-tag
                    size="mini"
                    :type="lessonTypeMap[lesson.type]?.type || 'info'"
                >
                  {{ lessonTypeMap[lesson.type]?.label || '其他' }}
                </el-tag>
              </div>
              <div class="lesson-content">
                <span class="meta">
                  <span class="duration">{{ lesson.createdAt }}</span>
                  <span class="difficulty">难度系数：{{ lesson.difficulty }}</span>
                </span>
                <div class="actions">
                  <el-button
                      type="text"
                      v-if="lesson.textUrl"
                      @click="handlePreview(lesson.textUrl)"
                  >
                    <el-icon><Document /></el-icon> 文档
                  </el-button>
                  <el-button
                      type="primary"
                      v-if="lesson.resources"
                      @click="handlePdfView(lesson.resources)"
                  >
                    <el-icon><View /></el-icon> 查看详情
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <el-empty v-else description="课程不存在或已被删除" />
    </div>

    <el-dialog
        v-model="dialogVisible"
        :title="courseDetail?.title || 'PDF 预览'"
        width="80%"
        top="5vh"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        class="pdf-dialog"
    >
      <div class="pdf-dialog-body">
        <PdfViewer :pdf-url="pdfUrl" />
      </div>
    </el-dialog>




  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { httpClient } from '@utils/request/request.js'
import { Document, View } from '@element-plus/icons-vue'
import VuePdfEmbed from 'vue-pdf-embed'
import VuePdfApp from "vue3-pdf-app";
import PdfViewer from '@/views/lesson/pdf/PdfViewer.vue'  // 路径请根据你的实际项目结构调整

const route = useRoute()
const courseDetail = ref(null)
const loading = ref(true)

const dialogVisible = ref(false)
const pdfUrl = ref('')

// 课程类型映射
const lessonTypeMap = {
  video: { label: '视频', type: 'danger' },
  text: { label: '图文', type: 'warning' },
  practice: { label: '练习', type: 'success' },
  pdf: { label: '课件', type: 'success' }
}

// 获取课程详情
const fetchCourseDetail = async () => {
  try {
    const id = route.params.id
    const { data } = await httpClient.get('/course/getDetails', {
      params: { id }
    })
    if (data.code === 1) {
      courseDetail.value = data.data
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 预览图文
const handlePreview = (url) => {
  window.open(url, '_blank')
}

// 打开 PDF 弹窗
const handlePdfView = (url) => {
  pdfUrl.value = url
  dialogVisible.value = true
}

// 下载资源（备用）
const handleDownload = (url) => {
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.click()
}

onMounted(() => {
  fetchCourseDetail()
})
</script>

<style scoped>
.course-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.course-banner {
  width: 100%;
  height: 300px;
  border-radius: 15px;
  margin-top: 30px;
  margin-bottom: 5px;
}

.course-base-info {
  margin: 30px 0;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.course-title {
  font-size: 28px;
  margin: 0 0 15px 0;
  color: #1a1a1a;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #666;
}

.meta-info .tag {
  font-size: 13px;
  border-radius: 10px;
  padding: 4px 10px;
}

.course-description {
  margin-bottom: 30px;
}
.course-description :deep(h2) {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 15px;
}

.lesson-list {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.lesson-list h2 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.lesson-item {
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  transition: background 0.3s ease;
}
.lesson-item:hover {
  background: #f8f8f8;
}

.lesson-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}
.lesson-header .index {
  color: #666;
  font-size: 14px;
}
.lesson-header .title {
  font-weight: 600;
  font-size: 16px;
  color: #222;
}

.lesson-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lesson-content .meta {
  color: #999;
  font-size: 13px;
  display: flex;
  gap: 20px;
}
.lesson-content .actions {
  display: flex;
  gap: 15px;
}
.lesson-content .el-button {
  padding: 5px 10px;
}
.lesson-content .el-button .el-icon {
  margin-right: 5px;
}
.lesson-content .actions .el-button:hover {
  color: #409EFF;
}

</style>
