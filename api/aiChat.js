export const chat = async (content) => {
  const body = {
    model: "gpt-oss:20b",
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    stream: false, // false代表一次性回應所有內容 而不是一個片段一個片段回傳
  }

  return await useApiStore().post(`/api/v1/aiChat/chat`, body)
}

export const allGroup = async () => {
  return await useApiStore().get(`/api/v1/aiChat/allGroup`)
}
