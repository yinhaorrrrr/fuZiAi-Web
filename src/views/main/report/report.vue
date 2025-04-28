<template>
  <el-container style="height: 100vh;">


    <el-container>
      <!-- 左侧 -->
      <el-aside width="40%" style="padding: 20px;">
        <el-card>
          <div class="emoji-loader" style="text-align: center; margin-bottom: 20px;">
            <div id="emoji" style="font-size: 80px;">😴</div>
            <div id="progress" style="font-size: 24px;">0%</div>
          </div>
        </el-card>

        <el-card style="margin-top: 20px;">
          <h2>排行榜</h2>
          <el-table :data="rankingData" border style="width: 100%; margin-top: 10px;">
            <el-table-column prop="rank" label="名次" width="60" />
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="score" label="经验值" />
          </el-table>
        </el-card>
      </el-aside>

      <!-- 右侧 -->
      <el-main style="padding: 20px;">
        <el-card>
          <h2>学习周报</h2>

          <el-card style="margin-top: 20px;">
            <h3>薄弱环节</h3>
            <p>{{ weakPoints }}</p>
          </el-card>

          <el-card style="margin-top: 20px;">
            <h3>本周学习总结</h3>
            <p>{{ weeklySummary }}</p>
          </el-card>

          <el-card style="margin-top: 20px;">
            <h3>下周学习计划</h3>
            <ul>
              <li v-for="(item, index) in nextWeekPlan" :key="index">{{ item }}</li>
            </ul>
          </el-card>
        </el-card>
      </el-main>
    </el-container>
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

// 页面加载时调用
fetchTop6Users()
fetchLatestLearningReport()

// 进度条和表情动画
const emojis = ['😴', '😪', '😕', '😐', '🙂', '😊', '😀', '😃', '😄', '😁', '🥳']
let progress = 0

onMounted(() => {
  const progressText = document.getElementById('progress')
  const emojiText = document.getElementById('emoji')

  function updateProgress() {
    progress++
    if (progress <= 100) {
      progressText.textContent = `${progress}%`
      if (progress % 10 === 0) {
        emojiText.textContent = emojis[progress / 10]
      }
      setTimeout(updateProgress, 120)
    }
  }
  updateProgress()
})
</script>

<style scoped>
/* 额外美化 */
.el-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px #ccc;
}

h2, h3 {
  color: #409EFF;
}
</style>
