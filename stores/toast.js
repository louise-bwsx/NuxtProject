import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const timer = ref(2500);
  const message = ref(``);
  const toastType = ref(``);

  // 需要再Template 加上 <Toast/>
  const showToast = (newMessage, type) => {
    message.value = newMessage
    toastType.value = type
    setTimeout(() => {
      toastType.value = ''
    }, timer.value)
  }

  return { timer, message, toastType, showToast }
})
