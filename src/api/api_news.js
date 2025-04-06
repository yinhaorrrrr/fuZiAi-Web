import {httpClient,setToken} from '@utils/request/request.js'

export function getNewsList() {
    return httpClient.get('/news/list')
}