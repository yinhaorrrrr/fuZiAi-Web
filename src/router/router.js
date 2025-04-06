import { createRouter, createWebHistory } from 'vue-router';
import Login from '@views/login/login.vue';
import Home from '@views/main/home.vue';
import Register from "@views/login/register.vue";
import {layer} from "@layui/layui-vue";
const routes = [
    {path:'/login',component: Login},
    {path:'/register',component: Register},
    {path:'/home',component: Home,meta: { requiresAuth: true }},
    {path: '/:pathMatch(.*)*', redirect: '/home'}, // 重定向到首页
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    // 如果目标页面需要登录并且用户没有 token，则跳转到登录页面
    if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
        layer.msg('请先登录', {icon: 2});
        router.push('/login');
    } else {
        next();
    }
});

export default router;