<template> <el-container class="dashboard-container"> <el-container> <!-- 左侧 --> <el-aside width="35%" class="dashboard-aside"> <el-card class="progress-card"> <div class="progress-container"> <div id="emoji" class="progress-emoji">😴</div> <div class="progress-wrapper"> <el-progress
    type="dashboard"
    :percentage="progress"
    :color="progressColors"
    :width="120"
    :stroke-width="10"
/> <div id="progress" class="progress-text">{{progress}}%</div> </div> <div class="progress-label">本周学习进度</div> </div> </el-card>

  ```
  <el-card class="ranking-card">
    <div class="card-header">
      <h2><i class="el-icon-trophy"></i> 排行榜</h2>
    </div>
    <el-table
        :data="rankingData"
        class="ranking-table"
        :row-class-name="tableRowClassName"
    >
      <el-table-column prop="rank" label="名次" width="70">
        <template #default="{row}">
          <span :class="`rank-${row.rank}`">{{row.rank}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="score" label="经验值" width="100">
        <template #default="{row}">
          <el-tag :type="getScoreTagType(row.score)">{{row.score}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</el-aside>

  <!-- 右侧 -->
  <el-main class="dashboard-main">
    <el-card class="report-card">
      <div class="card-header">
        <h2><i class="el-icon-notebook-2"></i> 学习周报</h2>
        <el-tag type="success">本周</el-tag>
      </div>

      <div class="report-section">
        <div class="section-header">
          <i class="el-icon-warning-outline"></i>
          <h3>薄弱环节</h3>
        </div>
        <div class="section-content">
          <p>{{ weakPoints || '暂无数据' }}</p>
        </div>
      </div>

      <div class="report-section">
        <div class="section-header">
          <i class="el-icon-document-checked"></i>
          <h3>本周学习总结</h3>
        </div>
        <div class="section-content">
          <p>{{ weeklySummary || '暂无数据' }}</p>
        </div>
      </div>

      <div class="report-section">
        <div class="section-header">
          <i class="el-icon-aim"></i>
          <h3>下周学习计划</h3>
        </div>
        <div class="section-content">
          <ul v-if="nextWeekPlan.length > 0">
            <li v-for="(item, index) in nextWeekPlan" :key="index">
              <i class="el-icon-check"></i>{{ item }}
            </li>
          </ul>
          <p v-else>暂无计划</p>
        </div>
      </div>
    </el-card>
  </el-main>
</el-container>
  ```

</el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {httpClient} from "@utils/request/request.js";

// 排行榜数据
const rankingData = ref([])

// 学习周报内容
const weakPoints = ref('')
const weeklySummary = ref('')
const nextWeekPlan = ref([])
const progress = ref(0)

// 进度条颜色
const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 获取经验值前六的用户
async function fetchTop6Users() {
  try {
    const response = await httpClient.get('/user/top6-users')
    const users = response.data || []

    // 排序（虽然一般接口已经是前六，但保险起见按经验值排序）
    const sortedUsers = users
        .sort((a, b) => b.experience - a.experience)
        .slice(0, 6)

    // 映射成前端需要的结构，加上rank
    rankingData.value = sortedUsers.map((user, index) => ({
      rank: index + 1,
      name: user.username,
      score: user.experience
    }))
  } catch (error) {
    console.error('获取排行榜失败:', error)
  }
}

// 获取用户最新学习周报
async function fetchLatestLearningReport() {
  try {
    const response = await httpClient.get('/learning-reports/user/latest', {
      headers: {
        token: localStorage.getItem('token') || '' // 从本地获取token，实际看你项目怎么存的
      }
    })
    const report = response.data || {}

    weakPoints.value = report.weakPoints || ''
    weeklySummary.value = report.thisWeekSummary || ''

    // 把 nextWeekPlan（字符串）转为数组，按换行符或句号分割
    nextWeekPlan.value = (report.nextWeekPlan || '')
        .split(/[\n。]/)
        .map(item => item.trim())
        .filter(item => item.length > 0) // 去掉空白项
  } catch (error) {
    console.error('获取学习周报失败:', error)
  }
}

// 表格行样式
const tableRowClassName = ({row}) => {
  if (row.rank === 1) return 'first-row'
  if (row.rank === 2) return 'second-row'
  if (row.rank === 3) return 'third-row'
  return ''
}

// 根据分数获取标签类型
const getScoreTagType = (score) => {
  if (score > 5000) return 'danger'
  if (score > 3000) return 'warning'
  if (score > 1000) return 'success'
  return ''
}

// 页面加载时调用
fetchTop6Users()
fetchLatestLearningReport()

// 进度条和表情动画
const emojis = ['😴', '😪', '😕', '😐', '🙂', '😊', '😀', '😃', '😄', '😁', '🥳']
const emojiText = ref('😴')

onMounted(() => {
  function updateProgress() {
    if (progress.value < 100) {
      progress.value++
      if (progress.value % 10 === 0) {
        emojiText.value = emojis[progress.value / 10]
      }
      setTimeout(updateProgress, 120)
    }
  }
  updateProgress()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.dashboard-aside {
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-main {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h2 {
    margin: 0;
    color: #333;
    font-size: 18px;
    display: flex;
    align-items: center;

    i {
      margin-right: 8px;
      color: #409EFF;
    }
  }
}

.progress-card {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.progress-emoji {
  font-size: 60px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.progress-wrapper {
  position: relative;
  margin-bottom: 15px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.progress-label {
  font-size: 16px;
  color: #666;
}

.ranking-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ranking-table {
  flex: 1;

  :deep(.el-table__row) {
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .rank-1 {
    color: #f56c6c;
    font-weight: bold;
  }

  .rank-2 {
    color: #e6a23c;
    font-weight: bold;
  }

  .rank-3 {
    color: #5cb87a;
    font-weight: bold;
  }
}

:deep(.first-row) {
  background-color: #fffaf6;

  td {
    background-color: transparent !important;
  }
}

:deep(.second-row) {
  background-color: #f9f9f9;

  td {
    background-color: transparent !important;
  }
}

:deep(.third-row) {
  background-color: #f6fbf6;

  td {
    background-color: transparent !important;
  }
}

.report-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.report-section {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  h3 {
    margin: 0 0 0 8px;
    font-size: 16px;
    color: #555;
  }

  i {
    color: #409EFF;
    font-size: 18px;
  }
}

.section-content {
  color: #666;
  line-height: 1.6;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 8px 0;
      border-bottom: 1px dashed #eee;
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }

      i {
        margin-right: 8px;
        color: #67c23a;
      }
    }
  }
}

.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
}
</style>
