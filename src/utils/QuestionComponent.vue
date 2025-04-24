<template>
  <el-dialog
      v-model="props.modelValue"
      width="900px"
      top="5vh"
      center
      :close-on-click-modal="false"
      :show-close="false"
      class="question-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <span>练习题（{{ completedCount }}/{{ state.questionList.length }}）</span>
        <el-progress
            :percentage="progressPercentage"
            :color="progressColor"
            :stroke-width="16"
            :show-text="false"
        />
      </div>
    </template>

    <div class="container">
      <!-- 左侧题目区域 -->
      <div class="question-main" v-loading="state.loading">
          <!-- 使用过渡动画包裹内容 -->
          <transition name="fade" mode="out-in">
            <el-skeleton :loading="state.loading && !state.currentQuestion" animated>
              <template #template>
                <el-skeleton-item variant="text" style="width: 80%; height: 32px" />
                <el-skeleton-item variant="image" style="width: 100%; height: 200px; margin-top: 20px" />
                <div style="margin-top: 30px">
                  <el-skeleton-item v-for="i in 4" :key="i" variant="text" style="width: 90%; height: 24px" />
                </div>
              </template>

              <template #default>
                <template v-if="state.currentQuestion">
                  <div class="question-content">
                    <div class="question-header">
                      <h3>{{ state.currentQuestion.questionText }}</h3>
                      <img
                          v-if="state.currentQuestion.imageURL"
                          :src="state.currentQuestion.imageURL"
                          class="question-image"
                          alt="题目图片"
                      />
                    </div>

                    <el-radio-group
                        v-model="state.selectedAnswer"
                        @change="handleAnswer"
                        :disabled="state.answered"
                        class="option-group"
                    >
                      <el-radio
                          v-for="(option, key) in ['A', 'B', 'C', 'D']"
                          :key="key"
                          :label="option"
                          class="option-item"
                      >
                        <div class="option-inner">
                          <span class="option-label">{{ option }}.</span>
                          <span class="option-text">{{ state.currentQuestion[`option${option}`] }}</span>
                        </div>
                      </el-radio>
                    </el-radio-group>

                    <div v-if="state.answered" class="answer-feedback">
                      <el-alert
                          :title="feedbackTitle"
                          :type="state.isCorrect ? 'success' : 'error'"
                          show-icon
                          :closable="false"
                      />
                    </div>
                  </div>
                </template>

                <div v-else class="completion-message">
                  <el-result
                      icon="success"
                      :title="`正确率：${correctRate}%`"
                      subTitle="恭喜完成所有题目！"
                  >
                    <template #extra>
                      <el-button type="primary" @click="reset">重新练习</el-button>
                    </template>
                  </el-result>
                </div>
              </template>
            </el-skeleton>
          </transition>
        </div>

      <!-- 右侧题目导航 -->
      <div class="question-nav">
        <div class="nav-header">题目列表</div>
        <div class="question-grid">
          <div
              v-for="(id, index) in state.questionList"
              :key="id"
              class="question-box"
              :class="{
              'current': index === state.currentIndex,
              'correct': state.questionStatus[index] === 'correct',
              'wrong': state.questionStatus[index] === 'wrong'
            }"
              @click="jumpQuestion(index)"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <div>
          <el-button @click="prevQuestion" :disabled="state.currentIndex === 0" icon="ArrowLeft">上一题</el-button>
          <el-button @click="nextQuestion" :disabled="state.currentIndex === state.questionList.length - 1" icon="ArrowRight">下一题</el-button>
        </div>
        <span class="progress-text">{{ state.currentIndex + 1 }}/{{ state.questionList.length }}</span>
        <div>
          <el-button type="danger" icon="Close" @click="closeDialog">关闭</el-button>
          <el-button type="success" icon="CircleCheck" @click="finishPractice" :disabled="state.finished">完成</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, computed, watch, onMounted, nextTick} from 'vue'
import { httpClient } from "@utils/request/request.js"
import { ElMessageBox, ElMessage } from 'element-plus'

onMounted(() => { initQuestions()
})

const props = defineProps({
  questionIds: {
    type: Array,
    default: () => []
  },
  modelValue: {  // 添加这个prop来控制显示/隐藏
    type: Boolean,
    default: false
  }
})

watch(() => props.questionIds, (newVal, oldVal) => {
  console.log('questionIds 变化:', { newVal, oldVal })
  initQuestions()
}, { deep: true }) // deep: true 用于深度监听数组/对象变化


const emit = defineEmits(['update:modelValue'])

const state = reactive({
  dialogVisible: true,
  loading: false,
  currentIndex: 0,
  questionList: [],
  currentQuestion: null,
  selectedAnswer: '',
  answered: false,
  isCorrect: false,
  correctAnswer: '',
  questionStatus: [],
  finished: false,
})

const tempQuestion = reactive({ current: null }) // 保留当前展示题目


const feedbackTitle = computed(() => state.isCorrect ? '回答正确！' : `回答错误！正确答案是：${state.correctAnswer}`)
const completedCount = computed(() => state.questionStatus.filter(s => s).length)
const progressPercentage = computed(() => (completedCount.value / state.questionList.length) * 100)
const progressColor = computed(() => {
  const rate = completedCount.value / state.questionList.length
  return rate >= 0.8 ? '#67C23A' : rate >= 0.5 ? '#E6A23C' : '#F56C6C'
})
const correctRate = computed(() => {
  const correctCount = state.questionStatus.filter(s => s === 'correct').length
  return ((correctCount / state.questionList.length) * 100).toFixed(1)
})

const initQuestions = () => {
  state.questionList = props.questionIds.map(id => ({ id, userAnswer: '', questionStatus: null }))
  state.questionStatus = new Array(props.questionIds.length).fill(null)
  state.currentIndex = 0
  state.finished = false
  resetQuestionState()
  if (state.questionList.length > 0) {
    fetchQuestion(state.questionList[0].id)
  }
}


const fetchQuestion = async (id) => {
  try {
    state.loading = true
    state.isTransitioning = true

    // 先获取新题目数据
    const response = await httpClient.get(`/questions/details/${id}`)
    if (response.data.code === 1) {
      tempQuestion.current = response.data.data

      // 短暂延迟让过渡动画更平滑
      await new Promise(resolve => setTimeout(resolve, 100))

      // 恢复答题状态
      restoreAnswerState()

      // 更新当前题目
      state.currentQuestion = tempQuestion.current
    }
  } finally {
    state.loading = false
    state.isTransitioning = false
  }
}


const checkAnswer = async (idObj, userAnswer) => {
  const response = await httpClient.get(`/questions/${idObj.id}/answer`)
  if (response.data.code === 1) {
    state.correctAnswer = response.data.data
    state.isCorrect = userAnswer === state.correctAnswer
    state.answered = true
    state.questionStatus[state.currentIndex] = state.isCorrect ? 'correct' : 'wrong'
    idObj.questionStatus = state.isCorrect ? 'correct' : 'wrong'
    idObj.userAnswer = userAnswer

    if (state.isCorrect) {
      setTimeout(nextQuestion, 800)
    }
  }
}

const handleAnswer = (val) => {
  if (!state.answered) {
    checkAnswer(state.questionList[state.currentIndex], val)
  }
}

const jumpQuestion = (index) => {
  if (index === state.currentIndex) return
  state.currentIndex = index
  resetQuestionState()
  fetchQuestion(state.questionList[index].id)
}

const prevQuestion = () => {
  if (state.currentIndex > 0) {
    state.currentIndex--
    resetQuestionState()
    fetchQuestion(state.questionList[state.currentIndex].id)
  }
}

const nextQuestion = () => {
  if (state.currentIndex < state.questionList.length - 1) {
    state.currentIndex++
    resetQuestionState()
    fetchQuestion(state.questionList[state.currentIndex].id)
  }
}

const reset = () => {
  initQuestions()
}

const resetQuestionState = () => {
  state.selectedAnswer = ''
  const current = state.questionList[state.currentIndex]
  state.answered = !!current.questionStatus
  if (state.answered) {
    state.selectedAnswer = current.userAnswer
    state.correctAnswer = current.questionStatus === 'correct' ? current.userAnswer : ''
    state.isCorrect = current.questionStatus === 'correct'
  } else {
    state.correctAnswer = ''
    state.isCorrect = false
  }
}

const restoreAnswerState = () => {
  const current = state.questionList[state.currentIndex]
  if (current.userAnswer) {
    state.selectedAnswer = current.userAnswer
    state.answered = true
    state.isCorrect = current.questionStatus === 'correct'
    if (!state.isCorrect) {
      httpClient.get(`/questions/${current.id}/answer`).then(res => {
        if (res.data.code === 1) {
          state.correctAnswer = res.data.data
        }
      })
    } else {
      state.correctAnswer = current.userAnswer
    }
  } else {
    state.selectedAnswer = ''
    state.answered = false
    state.correctAnswer = ''
    state.isCorrect = false
  }
}

const finishPractice = () => {
  ElMessageBox.confirm(
      `你已完成 ${completedCount.value} / ${state.questionList.length} 题，是否确认提交？`,
      '完成练习',
      {
        confirmButtonText: '提交',
        cancelButtonText: '继续练习',
        type: 'warning',
      }
  ).then(() => {
    state.finished = true
    ElMessage.success(`练习完成，正确率为 ${correctRate.value}%`)
  }).catch(() => {})
}


// 修改原来的closeDialog方法
const closeDialog = () => {
  emit('update:modelValue', false)
}
</script>


<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 24px;
  min-height: 75vh;
  max-height: 80vh;
  overflow-y: auto;
  height: 70%;
}

.container {
  display: flex;
  gap: 24px;
  height: 70vh;
}

.question-main {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px; // 防止遮挡滚动条
}

.question-nav {
  width: 260px;
  overflow-y: auto;
  border-left: 1px solid #ebeef5;
  padding-left: 24px;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.question-content {
  transition: all 0.3s ease;
}
.question-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.question-header {
  margin-bottom: 28px;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
}

.question-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-top: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
}

.option-group {
  width: 100%;
}

.option-item {
  display: block;
  margin-bottom: 18px;
  transition: all 0.3s ease;
}

.option-item:hover {
  transform: translateX(4px);
}

.option-item:deep(.el-radio__input) {
  margin-top: 2px;
}

.option-item:deep(.el-radio__label) {

  display: inline-flex;
  width: calc(100% - 24px);
}

.option-inner {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.option-item.is-checked .option-inner {
  background-color: #e6f7ff;
  border: 1px solid #1890ff;
}

.option-label {
  font-weight: bold;
  color: #1890ff;
  margin-right: 10px;
  min-width: 20px;
}

.option-text {
  flex: 1;
  color: #333;
  line-height: 1.5;
}

.answer-feedback {
  margin-top: 24px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-content {
    padding: 16px;
  }

  .question-text {
    font-size: 16px;
  }

  .option-inner {
    padding: 10px 12px;
  }
}
.question-nav {
  border-left: 1px solid #ebeef5;
  padding-left: 24px;

  .nav-header {
    font-weight: 500;
    margin-bottom: 16px;
  }

  .question-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;

    .question-box {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: #f5f7fa;
      cursor: pointer;
      transition: all 0.2s;

      &.current {
        background: var(--el-color-primary);
        color: white;
      }
      &.correct {
        background: #67c23a;
        color: white;
      }
      &.wrong {
        background: #f56c6c;
        color: white;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .progress-text {
    color: #666;
    font-size: 14px;
  }
}

.dialog-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
</style>