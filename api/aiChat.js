export const postChatStream = async (parentId, groupId, userId, messages, callbacks) => {
  const body = {
    model: "gpt-oss:20b",
    parentId: parentId,
    userId: userId,
    groupId: groupId,
    messages: messages,
    stream: true,
  }

  // callbacks 包含 onMessage, onError, onDone
  await useApiStore().postStream(`/api/v1/aiChat/chat`, body, callbacks)
}

export const postGenerateTitle = async (userId, content) => {
  const body = {
    userId: userId,
    model: "gpt-oss:20b",
    content: content,
    stream: false, // false代表一次性回應所有內容 而不是一個片段一個片段回傳
  }

  return await useApiStore().post(`/api/v1/aiChat/title`, body)
}

export const allGroup = async () => {
  return await useApiStore().get(`/api/v1/aiChat/allGroup?userId=${useAuthStore().getUserInfo.id}`)
}

export const chatList = async (groupId) => {
  return await useApiStore().get(`/api/v1/aiChat/chatList?uid=${groupId}`)
}

export const status = async () => {
  return await useApiStore().get(`/api/v1/aiChat/status`)
}
