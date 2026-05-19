import { defineStore } from "pinia"

export const useToastStore = defineStore("toast", () => {
  const timer = ref(2500)
  const toasts = ref([])

  // 需要再Template 加上 <Toast/>
  const showToast = (message, type, duration) => {
    const id = Date.now()
    toasts.value.push({ id, message, toastType: type })
    setTimeout(() => removeToast(id), duration ?? timer.value)
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  return { timer, toasts, showToast, removeToast }
})
