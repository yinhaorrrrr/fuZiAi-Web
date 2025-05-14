<template>
  <div class="background-layer"></div>
  <div class="container">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="logo">夫子AI</div>
      <ul class="nav">
        <li :class="{active: currentView === 'welcome'}" @click="currentView = 'welcome'">首页</li>
        <li :class="{active: currentView === 'noise'}" @click="currentView = 'noise'">白噪音</li>
        <li :class="{active: currentView === 'course'}" @click="currentView = 'course'">课程列表</li>
        <li :class="{active: currentView === 'question'}" @click="currentView = 'question'">题目列表</li>
        <li  @click="currentView = 'question'">知识图谱</li>
        <li>
          <a href="https://iai.aichatos8.com.cn/#/home?from=lg" target="_blank" style="text-decoration: none; color: inherit;">
            智能问答
          </a>
        </li>
      </ul>
      <div class="user-box" @mouseenter="showUserMenu=true" >
        <img src="https://upload-bbs.miyoushe.com/upload/2023/07/08/306223175/6d409dc333126b6019a1ce94d95f7a16_6666661978056974830.jpg?x-oss-process=image/resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg" class="avatar" alt="用户头像">
        <transition name="fade">
          <div v-show="showUserMenu" class="user-menu"  @mouseenter="showUserMenu=true" @mouseleave="hideUserMenu">
            <div class="menu-item">
              <i class="icon-experience"></i>经验值: 1500
            </div>
            <div class="menu-item" @click="currentView = 'report'">
              <i class="icon-report"></i>学习周报
            </div>
            <div class="menu-item">
              <i class="icon-history"></i>历史记录
            </div>
            <div class="menu-item">
              <i class="icon-favorite"></i>收藏列表
            </div>
            <div class="menu-item logout" @click="logout">
                <i class="icon-logout"></i>登出
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="content" >
      <component :is="currentComponent" @update-view="currentView = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import router from "@/router/router.js";
import Welcome from "@/views/main/welcome/welcome.vue";
import Question from "@views/main/question/question.vue";

// 响应式数据
const currentView = ref('welcome');
const showUserMenu = ref(false);
import Noise from "@/views/main/noise/noise.vue";
import Course from "@/views/main/course/course.vue";
import Report from "@views/main/report/report.vue";

const hideTimeout = ref(null);

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'welcome':
      return Welcome;
    case 'noise':
      return Noise;
    case 'course':
      return Course;
    case 'question':
      return Question;
    case 'report':
      return Report; // 动态导入学习周报组件
    default:
      return Welcome;
  }
});


// 方法
const hideUserMenu = () => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
  }
  hideTimeout.value = setTimeout(() => {
    showUserMenu.value = false;
  }, 500);
};

const logout = () => {
  localStorage.clear("token");
  router.push("/login");
  console.log('Logout');
};

const navigateTo = (link) => {
  // 实际项目中这里应该是路由跳转
  console.log('Navigate to:', link);
};

const autoPlay = () => {
  // 这里填写自动播放逻辑
};

const fetchCarouselData = () => {
  // 获取轮播数据的逻辑
};

onMounted(() => {
  setInterval(autoPlay, 5000);
  fetchCarouselData();
});
</script>

<style>

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #c3e4ff 0%, #e3f5ff 100%);
  background: #60aff6;
  background: -webkit-linear-gradient(225deg, #60aff6 0%, #c7f9c6 100%);
  background: linear-gradient(225deg, #60aff6 0%, #c7f9c6 100%);
  z-index: -1;
}


.container {
  width: 100%;
}
.content
{
  width: 100%;
  margin-top: 70px;
}

body {
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  background-color: var(--secondary-color);
  line-height: 1.6;
}


.header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.6); /* 半透明背景 */
  backdrop-filter: blur(10px);          /* 毛玻璃模糊 */
  -webkit-backdrop-filter: blur(10px);  /* 兼容 Safari */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* 可选：底部分隔线 */
}


.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-right: 3rem;
  letter-spacing: 1px;
}

.nav {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav li {
  cursor: pointer;
  padding: 0.5rem 0;
  position: relative;
  transition: var(--transition);
  font-weight: 500;
}

.nav li:hover {
  color: var(--primary-color);
}

.nav li.active {
  color: var(--primary-color);
}

.nav li.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px;
}

/* 用户菜单 */
.user-box {
  position: relative;
  cursor: pointer;
  margin-left: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  transition: var(--transition);
}

.user-box:hover .avatar {
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
}

.user-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background: var(--white);
  box-shadow: var(--shadow-md);
  border-radius: 8px;
  width: 200px;
  overflow: hidden;
  z-index: 1001;
}

.menu-item {
  padding: 12px 16px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.menu-item:hover {
  background: rgba(93, 155, 155, 0.1);
  color: var(--primary-color);
}

.menu-item i {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logout {
  color: #ff6b6b;
}

/* 图标样式 */
.icon-experience {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235d9b9b"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm3.5 12.09l-1.41 1.41L12 13.42 9.91 15.5 8.5 14.09 10.59 12 8.5 9.91 9.91 8.5 12 10.59l2.09-2.09 1.41 1.41L13.42 12l2.08 2.09z"/></svg>') no-repeat center;
}

.icon-report {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235d9b9b"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>') no-repeat center;
}

.icon-history {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235d9b9b"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>') no-repeat center;
}

.icon-favorite {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235d9b9b"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>') no-repeat center;
}

.icon-logout {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>') no-repeat center;
}

</style>


