import {httpClient,setToken} from '@utils/request/request.js'

export function getNewsList() {
    return httpClient.get('/news/list')
}

export function getNewsById(id) {
    return httpClient.get('/news/detail', {
        params: {
            id: id
        }
    })
        .then(response => {
            return response.data; // 通常我们只需要返回data部分
        })
        .catch(error => {
            // 添加错误处理
            console.error('获取新闻详情失败:', error);
            throw error; // 重新抛出错误以便调用方处理
        });
}