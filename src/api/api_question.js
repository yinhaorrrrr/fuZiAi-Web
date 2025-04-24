// api/questions.js
import {httpClient} from "@utils/request/request.js";

export const fetchAllChapters = async () => {
    try {
        return httpClient.get('/questions/chapters')
    } catch (error) {
        throw new Error('获取章节列表失败: ' + error.message)
    }
}

export const fetchQuestionsByChapter = async (chapter) => {
    try {
        return httpClient.get(`/questions/chapter/${chapter}`)
    } catch (error) {
        throw new Error(`获取第 ${chapter} 章题目失败: ${error.message}`)
    }
}
