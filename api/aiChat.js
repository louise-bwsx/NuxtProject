export const postChatStream = async (
  isIncognito,
  model,
  parentId,
  groupId,
  userId,
  messages,
  callbacks,
) => {
  const body = {
    isIncognito: isIncognito,
    model: model,
    parentId: parentId,
    userId: userId,
    groupId: groupId,
    messages: messages,
    stream: true,
  }

  // callbacks 包含 onMessage, onError, onDone
  await useApiStore().postStream(`/api/v1/aiChat/chat`, body, callbacks)
}

export const postGenerateTitle = async (userId, model, content) => {
  const body = {
    userId: userId,
    model: model,
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

export const renameGroupTitle = async (groupId, title) => {
  const body = {
    groupId: groupId,
    title: title,
  }
  return await useApiStore().put(`/api/v1/aiChat/title`, body)
}

export const deleteGroupById = async (groupId) => {
  return await useApiStore().delete(`/api/v1/aiChat/group/${groupId}`)
}
