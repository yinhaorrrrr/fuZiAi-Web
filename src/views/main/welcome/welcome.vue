<template>
  <div class="container">


    <!-- 轮播图 -->
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <div class="carousel">
          <div v-for="(item, index) in carouselItems"
               :key="index"
               :class="['carousel-item', getCarouselClass(index)]"
               @click="showNews(item.id)"> <!-- 修改为传入item.id -->
            <img :src="item.imageUrl" :alt="item.title">
            <div class="caption">{{ item.title }}</div>
          </div>
        </div>

        <modal v-model:visible="showModal">
          <template #header>
            <h2>自定义标题</h2>
          </template>
          <p>这是弹窗的内容部分。</p>
          <div v-html="news.text"></div>
          <template #footer>
            <button @click="showModal = false">确定</button>
            <button @click="showModal = false">取消</button>
          </template>
        </modal>

        <div class="carousel-controls">
          <button class="control-btn prev-btn" @click="prevSlide">
            <i class="icon-arrow-left"></i>
          </button>
          <button class="control-btn next-btn" @click="nextSlide">
            <i class="icon-arrow-right"></i>
          </button>
        </div>
        <div class="carousel-indicators">
          <div v-for="(item, index) in carouselItems"
               :key="index"
               :class="['indicator', {active: currentSlide === index}]"
               @click="changeSlide(index)">
          </div>
        </div>
      </div>
    </div>


    <!-- 功能卡片 -->
    <div class="section-title">精选功能</div>
    <div class="card-container">
      <div v-for="(card, index) in cards"
           :key="index"
           class="card"
           @click="navigateTo(card.link)">
        <div class="card-image">
          <img :src="card.image" :alt="card.title">
        </div>
        <div class="card-content">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-desc">探索更多内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router/router.js";
import {getNewsById, getNewsList} from "@api/api_news.js";
import axios from "axios";
import Modal from 'E:\\web\\项目\\loginTest\\src\\utils\\Modal.vue';



export default {
  data() {
    return {
      currentNav: 'home',
      showUserMenu: false,
      currentSlide: 0,
      carouselItems: [
      ],
      cards: [
        { image: 'https://element-plus.org/images/CRMEB-l.png', title: '直播课程', link: '#' },
        { image: 'https://element-plus.org/images/misboot-left.png', title: '学习资料', link: '#' },
        { image: 'https://element-plus.org/images/jnpfsoft.png', title: '在线测试', link: '#' },
        { image: 'https://element-plus.org/images/mele-banner.png', title: '学习报告', link: '#' }
      ],
      htmlContent: '',
      isModalVisible: true,
      showModal: false,
      news:[]
    }
  },
  mounted() {
    setInterval(this.autoPlay, 5000);
    this.fetchCarouselData();
  },
  components: {
    Modal
  },
  methods: {
    //获取轮播图数据
    async fetchCarouselData() {
      try {
        const response = await getNewsList();
        this.carouselItems = response.data.data;
        console.log(this.carouselItems)// 假设返回的 data 是一个数组，包含轮播图的数据
      } catch (error) {
        console.error('轮播图数据加载失败', error);
      }
    },

    // 点击轮播图的图片，显示弹窗并获取详细内容
    async showNews(id) {
      try {
        // 调用接口并传入id，获取返回的数据
        const response = await getNewsById(id);
        // 假设返回的数据包含text字段，更新htmlContent
        this.news = response.data;
        console.log(this.news);
        // 显示弹窗
        this.showModal = true;
      } catch (error) {
        console.error('获取新闻详情失败', error);
      }
    },


    // 关闭弹窗
    closeModal() {
      this.showModal = false;
      this.news = ''; // 清空HTML内容
    },

    //轮播图相关逻辑
    getCarouselClass(index) {
      const total = this.carouselItems.length;
      const diff = (index - this.currentSlide + total) % total;
      return {
        'next': diff === 1,
        'prev': diff === total - 1,
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
      this.nextSlide();
    },

    hideUserMenu(){
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }
      this.hideTimeout = setTimeout(() => {
        this.showUserMenu = false;
      }, 500);
    },

    //登出
    logout(){
      localStorage.clear("token");
      router.push("/login");
      console.log('Logout');
    },
    navigateTo(link) {
      // 实际项目中这里应该是路由跳转
      console.log('Navigate to:', link);
    },


  }
}
</script>

<style>
/* 全局变量 */
:root {
  --primary-color: #5d9b9b;
  --secondary-color: #f8f9fa;
  --accent-color: #ff7e67;
  --text-color: #333;
  --text-light: #777;
  --white: #ffffff;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --transition: all 0.3s ease;
}

/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  background-color: var(--secondary-color);
  line-height: 1.6;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--white);
  box-shadow: var(--shadow-sm);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
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

.icon-arrow-left, .icon-arrow-right {
  width: 24px;
  height: 24px;
}

.icon-arrow-left {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235d9b9b"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>') no-repeat center;
}

.icon-arrow-right {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235d9b9b"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>') no-repeat center;
}

/* 轮播图容器 */
.carousel-container {
  width: 100%;
  margin-top: 80px;

  padding: 40px 0;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 400px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 轮播项 */
.carousel-item {
  position: absolute;
  width: 70%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.85);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0.6;
  z-index: 1;
  border-radius: 12px;
  overflow: hidden;

  background-color: #d3d3d3; /* 默认浅灰色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-item.active {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  z-index: 3;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.carousel-item.prev {
  transform: translate(-120%, -50%) scale(0.85);
  opacity: 0.6;
  z-index: 2;
}

.carousel-item.next {
  transform: translate(20%, -50%) scale(0.85);
  opacity: 0.6;
  z-index: 2;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  color: var(--white);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
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
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.control-btn:hover {
  background: var(--primary-color);
}

.control-btn:hover .icon-arrow-left,
.control-btn:hover .icon-arrow-right {
  filter: brightness(0) invert(1);
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
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
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: var(--transition);
}

.indicator.active {
  background: var(--white);
  transform: scale(1.3);
}

/* 卡片区域 */
.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 40px 0 30px;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: var(--accent-color);
  margin: 10px auto 0;
  border-radius: 2px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 0 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-md);
}

.card-image {
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.card-desc {
  font-size: 0.9rem;
  color: var(--text-light);
}

/* 动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .carousel-wrapper {
    height: 350px;
  }

  .carousel-item {
    width: 80%;
  }

  .nav {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .logo {
    margin-right: 1.5rem;
    font-size: 1.5rem;
  }

  .nav {
    gap: 1rem;
    font-size: 0.9rem;
  }

  .carousel-wrapper {
    height: 300px;
  }

  .caption {
    font-size: 1.2rem;
    padding: 1rem;
  }

  .card-container {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 576px) {
  .header {
    flex-wrap: wrap;
    padding: 0.5rem;
    height: auto;
  }

  .logo {
    width: 100%;
    text-align: center;
    margin: 0.5rem 0;
  }

  .nav {
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .user-box {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .carousel-container {
    margin-top: 120px;
    padding: 20px 0;
  }

  .carousel-wrapper {
    height: 250px;
  }

  .carousel-item {
    width: 90%;
  }

  .section-title {
    font-size: 1.5rem;
    margin: 30px 0 20px;
  }

  .card-container {
    grid-template-columns: 1fr;
    padding: 0 15px 40px;
  }

  .carousel {
    display: flex;
    overflow-x: auto;
    gap: 10px;
  }

  .carousel-item {
    position: relative;
    cursor: pointer;
  }

  .carousel-item img {
    width: 100%;
    height: auto;
    display: block;
  }

  .caption {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
  }

  .close-btn {
    margin-top: 10px;
    padding: 10px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
  }

  .close-btn:hover {
    background-color: darkred;
  }

}
</style>


