import { defineStore } from "pinia"
import { allGroup, postChatStream, postGenerateTitle, chatList } from "~/api/aiChat"

export const useAIChatStore = defineStore(`aiChat`, () => {
  const history = ref([])
  const input = ref(``)
  const groupList = ref([])
  const isLoading = ref(false)
  const groupId = ref(0)
  const title = ref(``)
  const parentId = ref(0)

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

    if (groupId.value == 0) {
      await generateTitle(content)
      getAllGroup()
    }

    const aiMessageIndex =
      history.value.push({
        role: "assistant",
        createdAt: useDateTimeStore().now(),
        content: "", // 初始內容為空
        model: "gpt-oss:20b",
      }) - 1

    // console.log(`postChatStream.groupId.value: ${groupId.value}`)
    postChatStream(parentId.value, groupId.value, useAuthStore().getUserInfo.id, history.value, {
      onMessage: (content) => {
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
    })
  }

  const generateTitle = async (content) => {
    const response = await postGenerateTitle(useAuthStore().getUserInfo.id, content)
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

  const onDropdownOptionClick = (option) => {
    console.log(option)
  }

  return {
    history,
    input,
    groupList,
    groupId,
    sendMessage,
    getAllGroup,
    getChatList,
    onDropdownOptionClick,
  }
})
