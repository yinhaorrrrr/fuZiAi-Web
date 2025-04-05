import axios from 'axios';
import { ref } from 'vue';

const token = ref('');

const diary = axios.create({
    baseURL: '/api',
    headers: {
        "Content-Type": 'application/json',
    }
});

export function setToken(newToken) {
    token.value = newToken; // 更新 token 值
}
// 获取最新的 token 值
const getToken = () => {
    return token.value;
}

diary.interceptors.request.use(
    config => {
        const authToken = getToken(); // 使用最新的 token
        if (authToken) {
            config.headers['token'] = authToken; // 添加 token
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export { diary, token };