<template>
  <!-- 在原有模板基础上新增/修改以下部分 -->
  <div class="course-container">
    <!-- 新增顶部装饰线 -->
    <div class="decorative-line"></div>

    <!-- 修改标题样式 -->
    <div class="title-wrapper">
      <h1 class="page-title">
        <el-icon class="title-icon"><Collection /></el-icon>
        课程列表
        <span class="course-count">（共 {{ pagination.total }} 门课程）</span>
      </h1>
    </div>

    <!-- 优化筛选栏 -->
    <div class="filter-bar">
      <el-row :gutter="20" justify="center">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-input
              v-model="filterParams.title"
              placeholder="搜索课程名称..."
              clearable
              size="large"
              @change="handleFilter"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-select
              v-model="filterParams.tag"
              placeholder="全部分类"
              clearable
              size="large"
              @change="handleFilter"
          >
            <el-option
                v-for="tag in tags"
                :key="tag"
                :label="tag"
                :value="tag"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- 优化课程卡片 -->
    <el-row :gutter="20" v-loading="loading" class="course-list">
      <el-col
          v-for="course in courses"
          :key="course.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="course-col"
      >
        <el-card class="course-card" shadow="hover">
          <div class="card-tag" :class="getDifficultyClass(course.difficulty)">
            {{ formatDifficultyText(course.difficulty) }}
          </div>
          <el-image
              :src="course.imageUrl || 'https://via.placeholder.com/300x150'"
              fit="cover"
              class="course-image"
              @error="handleImageError"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="course-content">
            <h3 class="course-title">
              <el-icon class="title-icon"><Notebook /></el-icon>
              {{ course.title }}
            </h3>
            <div class="course-meta">
              <div class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ formatDate(course.createTime) }}
              </div>
              <div class="meta-item">
                <el-icon><User /></el-icon>
                {{ course.students || 0 }}人学习
              </div>
            </div>
            <div class="course-footer">
              <el-button
                  type="primary"
                  size="small"
                  class="detail-btn"
                  @click="goToDetail(course.id)"
              >
                查看详情
              </el-button>

            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 优化分页样式 -->
    <div class="pagination-wrapper">
      <el-pagination
          background
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { httpClient } from '@utils/request/request.js'

import { Collection, Search, Picture, Notebook, Clock, User } from '@element-plus/icons-vue'
// 响应式数据
const courses = ref([])
const loading = ref(false)
const tags = ref(['前端', '后端', '移动开发', '人工智能']) // 示例标签，实际应从接口获取
import { useRouter } from 'vue-router'
const router = useRouter()
const goToDetail = (courseId) => {
  router.push(`/course/${courseId}`)
}

// 把难度数字格式化成文字
const formatDifficultyText = (difficulty) => {
  const value = parseFloat(difficulty)
  if (isNaN(value)) return '未知'
  return value.toFixed(1) // 保留一位小数
}

// 根据难度返回不同颜色class
const getDifficultyClass = (difficulty) => {
  const value = parseFloat(difficulty)
  if (isNaN(value)) return 'difficulty-unknown'
  if (value <= 2) return 'difficulty-easy'
  if (value <= 4) return 'difficulty-medium'
  return 'difficulty-hard'
}


const filterParams = reactive({
  title: '',
  tag: ''
})

const pagination = reactive({
  pageNum: 1,
  pageSize: 8,
  total: 0
})

// 方法
const fetchCourses = async () => {
  try {
    loading.value = true
    const params = {
      ...filterParams,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }

    const response = await httpClient.get('/course/get', { params })
    const { data } = response.data
    courses.value = data.data
    pagination.total = data.total
  } catch (error) {
    console.error('获取课程失败:', error)
    ElMessage.error('获取课程数据失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  pagination.pageNum = 1
  fetchCourses()
}

const handlePageChange = () => {
  fetchCourses()
}

const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x150'
}

// 生命周期钩子
onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
/* 新增/修改样式 */
.course-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
}

.decorative-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #409eff, transparent);
  border-radius: 2px;
}

.title-wrapper {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  display: inline-flex;
  align-items: center;
  font-size: 28px;
  color: #303133;
  padding: 10px 30px;
  background: linear-gradient(145deg, #f8f9fa, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.title-icon {
  margin-right: 12px;
  font-size: 32px;
  color: #409eff;
}

.course-count {
  margin-left: 12px;
  font-size: 16px;
  color: #909399;
  font-weight: normal;
}

.filter-bar {
  margin-bottom: 40px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.search-icon {
  font-size: 18px;
  margin-right: 8px;
}

.course-list {
  margin: 0 -10px;
}

.course-col {
  padding: 10px;
}

.course-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.card-tag {
  position: absolute;
  top: 5px;
  right: -25px;
  padding: 6px 30px;
  color: white;
  font-size: 12px;
  transform: rotate(45deg);
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.difficulty-easy { background: #67c23a; }
.difficulty-medium { background: #e6a23c; }
.difficulty-hard { background: #f56c6c; }
.difficulty-unknown { background: #909399; }

.course-image {
  width: 100%;
  height: 200px;
  border-radius: 12px 12px 0 0;
  transition: transform 0.3s;
}

.image-error {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #c0c4cc;
}

.course-content {
  padding: 20px;
}

.course-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin: 0 0 15px;
  color: #303133;
  line-height: 1.4;
}

.course-title .title-icon {
  font-size: 20px;
  margin-right: 8px;
  color: #409eff;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.meta-item .el-icon {
  margin-right: 4px;
  font-size: 14px;
}

.course-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.detail-btn {
  padding: 8px 20px;
  border-radius: 20px;
}

.pagination-wrapper {
  margin-top: 40px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}
</style>