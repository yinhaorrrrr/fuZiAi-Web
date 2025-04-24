import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/router'
import Layui from '@layui/layui-vue'
import '@layui/layui-vue/lib/index.css'
createApp(App).use(router).use(ElementPlus).use(Layui).mount('#app')