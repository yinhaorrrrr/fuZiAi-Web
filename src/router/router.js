import { createRouter, createWebHistory } from 'vue-router';
import Login from '@views/login/login.vue';
import Home from '@views/main/home.vue';
import Register from "@views/login/register.vue";
const routes = [
    {path:'/',component: Login},
    {path:'/register',component: Register},
    {path:'/home',component: Home}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;