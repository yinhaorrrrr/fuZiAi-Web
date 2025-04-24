<template>
  <!-- 章节选择对话框 -->
  <el-dialog
      v-model="dialogVisible"
      title="选择练习章节"
      width="600px"
      :close-on-click-modal="false"
      class="chapter-dialog"
  >
    <div class="dialog-content">
      <!-- 章节列表 -->
      <el-scrollbar height="400px">
        <div class="chapter-list">
          <div
              v-for="chapter in chapters"
              :key="chapter.id"
              class="chapter-item"
              :class="{ 'active': selectedChapter === chapter.id }"
              @click="selectChapter(chapter.id)"
          >
            <div class="chapter-info">
              <span class="chapter-number">第{{ chapter.id }}章</span>
              <span class="chapter-name">{{ chapter.name }}</span>
            </div>
            <div class="chapter-meta">
              <el-tag size="small" effect="plain" type="info">
                {{ chapter.questionCount || 0 }}题
              </el-tag>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
            type="primary"
            @click="confirmSelection"
            :disabled="!selectedChapter"
            :loading="loading"
        >
          开始练习
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, ref} from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean, // 控制对话框显示
  chapters: { // 章节列表
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

// 对话框状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 选择状态
const selectedChapter = ref(null)
const loading = ref(false)

// 选择章节
const selectChapter = (chapterId) => {
  selectedChapter.value = chapterId
}

// 确认选择
const confirmSelection = async () => {
  if (!selectedChapter.value) return

  loading.value = true
  try {
    // 这里可以添加加载逻辑
    emit('confirm', selectedChapter.value)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('选择章节失败: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chapter-dialog {
  --dialog-radius: 12px;
}

.chapter-dialog :deep(.el-dialog) {
  border-radius: var(--dialog-radius);
  overflow: hidden;
}

.chapter-dialog :deep(.el-dialog__header) {
  padding: 16px 24px;
  margin: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-bottom: 1px solid var(--el-border-color-light);
}

.chapter-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dialog-content {
  padding: 16px 0;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chapter-item:hover {
  background-color: var(--el-color-primary-light-9);
  transform: translateX(4px);
}

.chapter-item.active {
  background-color: var(--el-color-primary-light-8);
  border-left: 3px solid var(--el-color-primary);
}

.chapter-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chapter-number {
  min-width: 60px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.chapter-name {
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-light);
}
</style>