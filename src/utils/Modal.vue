<template>
  <teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <slot name="header">
            <h2>默认标题</h2>
          </slot>
          <button class="close-button" @click="closeModal">X</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button @click="closeModal">关闭</button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:visible', false);
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 80%;  /* 修改宽度为页面的80% */
  //max-width: 1000px;  /* 可设置最大宽度，避免过大 */
  max-height: 80%;  /* 限制高度为页面的80% */
  overflow-y: auto;  /* 当内容超出时显示垂直滚动条 */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 10px;
  max-height: calc(80vh - 140px);  /* 保证内容区域的最大高度，以适应页脚和页头 */
  overflow-y: auto;  /* 如果内容过长，显示滚动条 */
}

.modal-footer {
  text-align: right;
}
</style>
