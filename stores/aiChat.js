import { defineStore } from "pinia"
import { chat } from "~/api/aiChat"

export const useAIChatStore = defineStore(`aiChat`, () => {
  const history = ref([])
  const input = ref(``)
  const isComposing = ref(false)
  const isLoading = ref(false)

  const sendMessage = async () => {
    if (isLoading.value) return
    if (!input.value.trim()) return

    isLoading.value = true

    history.value.push({
      createdAt: useDateTimeStore().now(),
      content: input.value,
    })
    history.value.push({})

    const response = await chat(input.value)
    if (response.code != 0) {
      response.data.createdAt = useDateTimeStore().now()
      response.data.message = response.message
      useToastStore().showToast(response.message, `error`)
    }

    history.value[history.value.length - 1] = {
      createdAt: response.data.createdAt,
      content: response.data.message,
    }
    input.value = ``
    isLoading.value = false
  }

  const onDropdownOptionClick = (option) => {
    console.log(option)
  }

  return { history, input, isComposing, sendMessage, onDropdownOptionClick }
})
