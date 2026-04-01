import { defineStore } from "pinia"
import {
  allGroup,
  postChatStream,
  postGenerateTitle,
  chatList,
  status,
  renameGroupTitle,
  deleteGroupById,
} from "~/api/aiChat"

export const useAIChatStore = defineStore(`aiChat`, () => {
  const history = ref([])
  const input = ref(``)
  const groupList = ref([])
  const isLoading = ref(false)
  const groupId = ref(0)
  const title = ref(``)
  const model = ref(`qwen2.5:72b`)
  const parentId = ref(0)
  const isOnline = ref(false)
  const isIncognito = ref(false)

  const sendMessage = async (event) => {
    // 如果是 Shift + Enter，不做任何處理，讓它自然換行
    if (event.shiftKey) return

    // 攔截 Enter 的預設換行行為（避免送出後輸入框殘留換行）
    event.preventDefault()

    if (event.isComposing || isLoading.value) return

    const content = input.value.trim()

    if (!content) return

    isLoading.value = true
    input.value = ``

    // 1. 推入使用者的訊息
    history.value.push({
      role: "user",
      createdAt: useDateTimeStore().now(),
      content: content,
    })

    if (groupId.value == 0 && !isIncognito.value) {
      await generateTitle(content)
      getAllGroup()
    }

    const aiMessageIndex =
      history.value.push({
        role: "assistant",
        createdAt: useDateTimeStore().now(),
        content: "", // 初始內容為空
        model: model.value,
      }) - 1

    // console.log(`postChatStream.groupId.value: ${groupId.value}`)
    postChatStream(
      isIncognito.value,
      model.value,
      parentId.value,
      groupId.value,
      useAuthStore().getUserInfo.id,
      history.value,
      {
        onMessage: (content) => {
          // 這邊確定會逐字顯示 但好像會有延遲 如果在開始前資料全部取得後 就會一瞬間出來
          // console.log(`content: ${content}`)
          // 逐字累加內容
          history.value[aiMessageIndex].content += content || ""
        },
        onError: (err) => {
          useToastStore().showToast("串流發生錯誤: " + err.message, "error")
          isLoading.value = false
        },
        onDone: (lastInsertID) => {
          // console.log("🚀 ~ sendMessage ~ lastInsertID:", lastInsertID)
          parentId.value = lastInsertID
          isLoading.value = false
        },
      },
    )
  }

  const generateTitle = async (content) => {
    const response = await postGenerateTitle(useAuthStore().getUserInfo.id, model.value, content)
    if (response.code != 0) {
      useToastStore().showToast(response.message, `error`)
    }
    groupId.value = response.data.groupId
    title.value = response.data.title
    // console.log(`generateTitle.groupId.value: ${groupId.value}`)
  }

  const getAllGroup = async () => {
    const response = await allGroup()
    if (response.code != 0) {
      useToastStore().showToast(response.message, `error`)
    }

    groupList.value = response.data.groupList
  }

  const getChatList = async () => {
    const response = await chatList(groupId.value)
    if (response.code != 0) {
      useToastStore().showToast(response.message, `error`)
    }

    history.value = response.data.history
  }

  const getStatus = async () => {
    const response = await status(groupId.value)

    isOnline.value = response.code == 0
  }

  const updateGroupTitle = async (id, newTitle) => {
    const response = await renameGroupTitle(id, newTitle)
    if (response.code != 0) {
      useToastStore().showToast(response.message, `error`)
      return
    }
    useToastStore().showToast(response.message, `success`)
    // 直接更新本地資料，不需重新打 getAllGroup
    const target = groupList.value.find((g) => g.id === id)
    if (target) target.title = newTitle
  }

  const deleteGroup = async (id) => {
    const response = await deleteGroupById(id)
    if (response.code != 0) {
      useToastStore().showToast(response.message, `error`)
      return
    }
    groupList.value = groupList.value.filter((g) => g.id !== id)
    // 若刪除的是目前選中的對話，重置狀態
    if (groupId.value === id) {
      groupId.value = 0
      history.value = []
      parentId.value = 0
      title.value = ``
    }
    useToastStore().showToast(`已刪除對話`, `success`)
  }

  // 切換隱身模式
  const toggleIncognito = () => {
    isIncognito.value = !isIncognito.value
  }

  return {
    history,
    input,
    groupList,
    groupId,
    isOnline,
    isIncognito,
    model,
    getStatus,
    sendMessage,
    getAllGroup,
    getChatList,
    updateGroupTitle,
    deleteGroup,
    toggleIncognito,
  }
})
