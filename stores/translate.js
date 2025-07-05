import { defineStore } from 'pinia'

export const useTranslateStore = defineStore('translate', () => {
  // 英翻中 但是給日文 中文的部分會顯示未翻譯內容
  const translate = async (from, to, text) => {
    const body = {
      from,
      to,
      text,
    }
    try {
      // 沒辦法在這邊直接call lingva的API 會Cors
      // 因為瀏覽器不允許直接從前端呼叫外部 API
      const response = await useApi().post("/api/translate", body);

      console.log(`translation: ${response.translation}`);
      return response.translation;
    } catch (error) {
      console.error('Translation error:', error)
      throw error
    }
  }

  return { translate }
})