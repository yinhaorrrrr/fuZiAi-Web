import axios from 'axios';
import { ref } from 'vue';

const token = ref('');

const httpClient = axios.create({
    baseURL: '/api',
    headers: {
        "Content-Type": 'application/json',
    }
});

export function setToken(newToken) {
    localStorage.setItem('token', newToken);
}
// 获取最新的 token 值
const getToken = () => {
    return  localStorage.getItem('token');
}

const removeToken = () => {
    localStorage.removeItem('token');
}

httpClient.interceptors.request.use(
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

export { httpClient, token };