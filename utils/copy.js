export const copy = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    useToastStore().showToast("已複製", "success")
  }
}
