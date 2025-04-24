<template>
  <div class="practice-container">

    <!-- 上半部分：四个圆角卡片 -->
    <div class="cards-section">
      <el-row :gutter="16">
        <el-col :span="12" v-for="card in cards" :key="card.name">
          <el-card
              shadow="hover"
              class="practice-card"
              @click="handleCardClick(card.name);console.log(questionIds)"
          >
            <div class="card-content">
              <el-icon :size="28" :color="card.color" class="card-icon">
                <component :is="card.icon" />
              </el-icon>
              <div class="card-text">
                <h4 class="card-title">{{ card.title }}</h4>
                <p class="card-desc">{{ card.desc }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 随机练习的对话框 -->
    <el-dialog v-model="randomDialogVisible" title="随机练习" width="30%">
      <el-input-number v-model="randomQuestionNum" :min="1" :max="100" />
      <template #footer>
        <el-button @click="randomDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="startRandomPractice">确定</el-button>
      </template>
    </el-dialog>

    <!-- 章节选择的对话框 -->
    <el-dialog v-model="chapterDialogVisible" title="选择章节" width="50%">
      <el-select
          v-model="selectedChapter"
          placeholder="请选择章节"
          style="width: 100%"
      >
        <el-option
            v-for="chapter in chapters"
            :key="chapter"
            :label="chapter"
            :value="chapter"
        />
      </el-select>
      <template #footer>
        <el-button @click="chapterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="startChapterPractice">确定</el-button>
      </template>
    </el-dialog>

    <!-- 题目详情对话框 -->
    <QuestionDialog
        v-model="DialogVisible"
        :question-ids="questionIds"
    />
  </div>

    <!-- 下半部分：章节列表 -->
    <div class="chapters-section">
      <el-collapse
          v-model="activeChapters"
          accordion
          @change="handleChapterExpand"
          class="custom-collapse"
      >
        <el-collapse-item
            v-for="chapter in chapters"
            :key="chapter"
            :name="chapter"
            class="custom-collapse-item"
        >
          <template #title>
            <div class="chapter-header">
              <el-icon><Notebook /></el-icon>
              <span class="chapter-title">第 {{ chapter }} 章</span>
            </div>
          </template>

          <div v-if="loadingQuestions[chapter]" class="loading-wrapper">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>加载中...</span>
          </div>

          <template v-else-if="questionsByChapter[chapter]?.length > 0">
            <el-table
                :data="questionsByChapter[chapter]"
                style="width: 100%"
                stripe
                size="small"
                empty-text="暂无题目"
            >
              <el-table-column prop="id" label="ID" width="80" align="center" />
              <el-table-column prop="questionText" label="题干信息" min-width="200" />
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button
                      type="primary"
                      size="small"
                      plain
                      @click.stop="viewQuestionDetail(row)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <div v-else class="no-data">
            <el-empty description="暂无题目" :image-size="60" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>

<script setup>
import {ref, onMounted, markRaw} from 'vue'
import {
  ElMessage,
  ElCard,
  ElRow,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElIcon,
  ElTable,
  ElTableColumn,
  ElButton,
  ElEmpty
} from 'element-plus'
import {
  List,
  Notebook,
  Refresh,
  Collection,
  Loading
} from '@element-plus/icons-vue'
import { fetchAllChapters, fetchQuestionsByChapter } from '@/api/api_question.js'
import {httpClient} from "@utils/request/request.js";
import QuestionDialog from "@utils/QuestionComponent.vue";

// 卡片数据
const cards = ref([
  {
    name: 'sequential',
    title: '顺序练习',
    desc: '按顺序练习所有题目',
    icon: markRaw(List),
    color: '#409EFF'
  },
  {
    name: 'chapter',
    title: '章节练习',
    desc: '按章节选择练习',
    icon: markRaw(Notebook),
    color: '#67C23A'
  },
  {
    name: 'random',
    title: '随机练习',
    desc: '随机抽取题目练习',
    icon: markRaw(Refresh),
    color: '#E6A23C'
  },
  {
    name: 'mistakes',
    title: '错题记录',
    desc: '查看历史错题',
    icon: markRaw(Collection),
    color: '#F56C6C'
  }
])

const DialogVisible = ref(false)

// 随机练习相关状态
const randomDialogVisible = ref(false)
const randomQuestionNum = ref(10)

// 章节练习相关状态
const chapterDialogVisible = ref(false)
const selectedChapter = ref(null)

// 当前展开的章节
const activeChapters = ref([])

// 所有章节列表
const chapters = ref([])

// 各章节的题目列表
const questionsByChapter = ref({})

// 各章节的加载状态
const loadingQuestions = ref({})

const questionIds = ref([1, 2, 3, 4])

// 查看题目详情
const viewQuestionDetail = async(question) => {
  console.log('查看题目详情:', question)
  questionIds.value= [question.oid]
  DialogVisible.value=true
}

// 获取所有章节
const loadChapters = async () => {
  try {
    const result = (await fetchAllChapters()).data
    if (result.code === 1) {
      chapters.value = result.data
    } else {
      ElMessage.error(result.msg || '获取章节列表失败')
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 处理章节展开
const handleChapterExpand = async (chapter) => {
  if (!chapter || questionsByChapter.value[chapter]) return

  loadingQuestions.value[chapter] = true

  try {
    const result = (await fetchQuestionsByChapter(chapter)).data
    if (result.code === 1) {
      questionsByChapter.value[chapter] = result.data
    } else {
      ElMessage.error(result.msg || `获取第 ${chapter} 章题目失败`)
    }
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loadingQuestions.value[chapter] = false
  }
}

// 处理卡片点击
const handleCardClick = (cardName) => {
  ElMessage.info(`已进入${cards.value.find(c => c.name === cardName)?.title}模式`)
  switch (cardName) {
    case 'sequential':
      startSequentialPractice()
      break
    case 'chapter':
      chapterDialogVisible.value = true
      break
    case 'random':
      randomDialogVisible.value = true
      break
    case 'mistakes':
      // 这里假设错题记录的接口逻辑类似
      break
  }
}

// 开始顺序练习
const startSequentialPractice = async () => {
  try {
    const response = await httpClient.get('/questions/test/order')
    console.log(questionIds)
    questionIds.value = response.data.data
    console.log(questionIds)
    DialogVisible.value=true
  } catch (error) {
    console.error('获取顺序练习题目失败:', error)
    ElMessage.error('获取题目失败')
  }
}

const handleSingleCheckboxChange = (chapterId) => {
  selectedChapter.value = chapterId;
};

// 开始章节练习
const startChapterPractice = async () => {
  if (!selectedChapter.value) {
    ElMessage.warning('请选择章节')
    return
  }
  try {
    const response = await httpClient.get(`/questions/test/chapter/${selectedChapter.value}`)
    questionIds.value = response.data.data
    DialogVisible.value=true
  } catch (error) {
    console.error('获取章节题目失败:', error)
    ElMessage.error('获取题目失败')
  } finally {
    chapterDialogVisible.value = false
  }
}

// 开始随机练习
const startRandomPractice = async () => {
  try {
    const response = await httpClient.get('/questions/test/random', {
      params: {
        num: randomQuestionNum.value
      }
    })
    questionIds.value = response.data.data
    DialogVisible.value=true
  } catch (error) {
    console.error('获取随机题目失败:', error)
    ElMessage.error('获取题目失败')
  } finally {
    randomDialogVisible.value = false
  }
}


onMounted(() => {
  loadChapters()
})
</script>

<style scoped>
.practice-container {
  display: flex;
  flex-direction: column;
  height: 250px;

  padding: 20px;
  box-sizing: border-box;
  gap: 16px;
  background-color: var(--el-bg-color-page);
}

.cards-section {
  flex: 0 0 auto;
}
.chapters-section {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 12px;
}

.custom-collapse {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: none;
  --el-collapse-border-color: transparent;
}

.custom-collapse-item {
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
}

.custom-collapse-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

:deep(.custom-collapse-item .el-collapse-item__header) {
  height: 52px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  background-color: #f5f7fa;
  border-bottom: none;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

:deep(.custom-collapse-item .el-collapse-item__header:hover) {
  background-color: #ebf1f6;
}

:deep(.custom-collapse-item .el-collapse-item__content) {
  padding: 16px 20px;
  animation: fadeIn 0.3s ease;
  background-color: #fff;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chapter-title {
  font-weight: 600;
  font-size: 16px;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 10px;
  color: #409EFF;
  font-size: 15px;
}

.no-data {
  padding: 24px 10px;
  text-align: center;
  color: #999;
}

/* 进入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.practice-card {
  margin-bottom: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s var(--el-transition-function-ease-in-out-bezier);
}

.practice-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--el-box-shadow);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

.card-icon {
  flex: 0 0 auto;
}

.card-text {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.card-desc {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
  color: var(--el-text-color-secondary);
}

.no-data {
  padding: 20px;
}

.cards-section {
  margin-bottom: 20px;
}

.practice-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.practice-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.card-icon {
  margin-right: 15px;
}

.card-text {
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.card-desc {
  margin: 5px 0 0;
  font-size: 12px;
  color: #909399;
}

.chapter-radio {
  display: block;
  margin: 10px 0;
}
</style>