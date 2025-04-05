<template>
  <div class="container">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="logo">FuZiAI</div>
      <ul class="nav">
        <li :class="{active: currentNav === 'home'}">首页</li>
        <li :class="{active: currentNav === 'noise'}">白噪音</li>
        <li :class="{active: currentNav === 'course'}">课程列表</li>
        <li :class="{active: currentNav === 'question'}">题目列表</li>
      </ul>
      <div class="user-box" @mouseenter="showUserMenu=true" @mouseleave="hideUserMenu">
        <img src="https://element-plus.org/images/element-plus-logo.svg" class="avatar" alt="aaa">
        <transition name="fade">
          <div v-show="showUserMenu" class="user-menu">
            <div class="menu-item">经验值: 1500</div>
            <div class="menu-item">学习周报</div>
            <div class="menu-item">历史记录</div>
            <div class="menu-item">收藏列表</div>
            <div class="menu-item logout">登出</div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="carousel-container">
      <div class="carousel">
        <div v-for="(item, index) in carouselItems"
             :key="index"
             :class="['carousel-item', getCarouselClass(index)]"
             @click="changeSlide(index)">
          <img :src="item.image" alt="">
          <div class="caption">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 功能卡片 -->
    <div class="card-container">
      <div v-for="(card, index) in cards"
           :key="index"
           class="card"
           @click="navigateTo(card.link)">
        <img :src="card.image" alt="">
        <div class="card-title">{{ card.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentNav: 'home',
      showUserMenu: false,
      currentSlide: 0,
      carouselItems: [
        { image: 'https://element-plus.org/images/mele-banner.png', title: '新课推荐：Vue3实战课程' },
        { image: 'https://element-plus.org/images/misboot-left.png', title: '前端架构设计指南' },
        { image: 'https://element-plus.org/images/jnpfsoft.png', title: '交互设计大师课' },
        { image: 'https://element-plus.org/images/mele-banner.png', title: 'Python数据分析实战'}
      ],
      cards: [
        { image: 'https://element-plus.org/images/CRMEB-l.png', title: '直播课程', link: '#' },
        { image: 'https://element-plus.org/images/misboot-left.png', title: '学习资料', link: '#' },
        { image: 'https://element-plus.org/images/jnpfsoft.png', title: '在线测试', link: '#' },
        { image: 'https://element-plus.org/images/mele-banner.png', title: '学习报告', link: '#' },
        { image: 'https://element-plus.org/images/mele-banner.png', title: '学习报告', link: '#' }
      ]
    }
  },
  mounted() {
    setInterval(this.autoPlay, 5000);
  },

  methods: {
    getCarouselClass(index) {
      const total = this.carouselItems.length;
      const diff = (index - this.currentSlide + total) % total;
      return {
        'prev': diff === 1,
        'next': diff === total - 1,
        'active': diff === 0
      };
    },
    changeSlide(index) {
      this.currentSlide = index;
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.carouselItems.length) % this.carouselItems.length;
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
    },
    autoPlay() {
      this.prevSlide(); // 改为向左滑动
    },
    hideUserMenu(){
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }
      // 设置新的定时器，延迟一秒后隐藏菜单
      this.hideTimeout = setTimeout(() => {
        this.showUserMenu = false;
      }, 1000); // 延迟一秒
    }
  }
}
</script>

<style>



/* 基础样式 */
:root {
  --primary-color: #ecffec;
  --accent-color: #85b500;
}

.container {
  width: 100%; /* 宽度为100%，始终与浏览器宽度一致 */
  height: 100%;
  margin: 0 auto; /* 水平居中对齐 */
  box-sizing: border-box; /* 包括 padding 和 border 在内 */
}



.header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--primary-color);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: fixed;
  width: 80%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);  /* 水平居中 */
  z-index: 1000;
}


.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--accent-color);
  margin-right: 4rem;
}

.nav {
  display: flex;
  gap: 3rem;
  list-style: none;
  flex-grow: 1;
}

.nav li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.3s;
}

.nav li.active {
  border-bottom: 2px solid var(--accent-color);
}

/* 用户菜单 */
.user-box {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
}

.user-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  width: 150px;
}

.menu-item {
  padding: 12px;
  transition: background 0.3s;
}

.menu-item:hover {
  background: var(--primary-color);
}
/* 轮播图容器优化 */
.carousel-container {
  width: 60%;
  margin: 0 auto;
  margin-top: 80px;
  height: 450px;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 450px;
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 轮播项优化 */
.carousel-item {
  position: absolute;
  width: 60%;
  height: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0.6;
  z-index: 1;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}

.carousel-item.active {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  z-index: 3;
}

.carousel-item.prev {
  transform: translate(-125%, -50%) scale(0.8) rotateY(15deg);
  opacity: 0.6;
  z-index: 2;
}

.carousel-item.next {
  transform: translate(25%, -50%) scale(0.8) rotateY(-15deg);
  opacity: 0.6;
  z-index: 2;
}

/* 控制按钮 */
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  z-index: 4;
  padding: 0 20px;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  border: none;
  font-size: 24px;
  color: var(--accent-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.control-btn:hover {
  background: var(--accent-color);
  color: white;
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 4;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: var(--accent-color);
  transform: scale(1.3);
}

/* 图片和标题优化 */
.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  color: white;
  border-radius: 0 0 15px 15px;
  text-align: center;
  font-size: 1.2rem;
}

/* 阴影优化 */
.carousel-item.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 10%;
  right: 10%;
  height: 30px;
  background: rgba(0,0,0,0.2);
  filter: blur(15px);
  z-index: -1;
  border-radius: 50%;
}

/* 卡片容器 */
.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 2rem;
  width: 80%;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.card-title {
  text-align: center;
  padding: 1rem;
  font-weight: bold;
  color: #666;
}

/* 动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>