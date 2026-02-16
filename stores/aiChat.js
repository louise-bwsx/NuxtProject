import { defineStore } from "pinia"
import { allGroup, chat } from "~/api/aiChat"

export const useAIChatStore = defineStore(`aiChat`, () => {
  const history = ref([])
  const input = ref(``)
  const groupList = ref([])
  const isLoading = ref(false)

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
    history.value.push({
      createdAt: useDateTimeStore().now(),
      content: content,
    })

    history.value.push({})

    const response = await chat(content)
    if (response.code != 0) {
      response.data.createdAt = useDateTimeStore().now()
      response.data.message = response.message
      useToastStore().showToast(response.message, `error`)
    }

    history.value[history.value.length - 1] = {
      createdAt: response.data.createdAt,
      content: response.data.message,
    }
    isLoading.value = false
  }

  const getAllGroup = async () => {
    const response = await allGroup()
    if (response.code != 0) {
      useToastStore().showToast(response.message, `error`)
    }

    groupList.value = response.data.groupList
  }

  const onDropdownOptionClick = (option) => {
    console.log(option)
  }

  return { history, input, groupList, sendMessage, getAllGroup, onDropdownOptionClick }
})
