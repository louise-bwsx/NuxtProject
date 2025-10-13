import { defineStore } from "pinia"
import { chat } from "~/api/aiChat"

export const useAIChatStore = defineStore(`aiChat`, () => {
  const history = ref([])
  const input = ref(``)
  const isComposing = ref(false)
  const isLoading = ref(false)

  const sendMessage = async () => {
    if (isLoading.value) return

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

  const onDropdownOptionClick = (option) => {
    console.log(option)
  }

  return { history, input, isComposing, sendMessage, onDropdownOptionClick }
})
