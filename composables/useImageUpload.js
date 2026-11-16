// 圖片貼上 / 拖放上傳，並把結果以 markdown 插入 content
export const useImageUpload = (content, textareaRef) => {
  const PLACEHOLDER_REGEX = new RegExp(`!\\[上傳中\\.\\.\\.\\]\\(uploading-[^)]+\\)\\n?`)

  // 檢查文件是否為圖片
  const isImageFile = (file) => {
    return file && file.type && file.type.startsWith('image/')
  }

  // 在游標位置插入文本
  const insertTextAtCursor = (text) => {
    const textarea = textareaRef.value
    if (!textarea) return

    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const beforeText = content.value.substring(0, startPos)
    const afterText = content.value.substring(endPos)

    content.value = beforeText + text + afterText

    // 設置新的游標位置
    nextTick(() => {
      const newPos = startPos + text.length
      textarea.setSelectionRange(newPos, newPos)
      textarea.focus()
    })
  }

  const uploadFile = async (file) => {
    try {
      // 先插入一個占位符
      const placeholder = `![上傳中...](uploading-${file.name})\n`
      insertTextAtCursor(placeholder)

      // 上傳圖片
      const formData = new FormData()
      formData.append('file', file)
      const response = await useApiStore().post('/api/v1/image', formData)
      if (response.code === 0) {
        useToastStore().showToast("上傳成功", "success")
      } else {
        useToastStore().showToast(`上傳失敗: ${response.message}`, "error")
      }
      const newFileName = response.data.fileName

      // 替換占位符為實際的圖片鏈接
      const imageName = file.name.replace(/\.[^/.]+$/, '') // 移除副檔名作為 alt text
      const imageMarkdown = `![${imageName}](http://www.louise.tw/static/images/${newFileName})\n`

      content.value = content.value.replace(PLACEHOLDER_REGEX, imageMarkdown)
    } catch (error) {
      console.error('上傳失敗:', error)
      // 移除占位符
      content.value = content.value.replace(PLACEHOLDER_REGEX, `<!-- 圖片上傳失敗: ${error.message} -->\n`)

      ElMessage.error(`圖片上傳失敗: ${error.message}`)
    }
  }

  // 處理粘貼事件
  const handlePaste = async (event) => {
    const clipboardData = event.clipboardData || window.clipboardData
    if (!clipboardData) return

    const items = Array.from(clipboardData.items)
    const imageItems = items.filter(item => isImageFile(item.getAsFile()))

    if (imageItems.length === 0) return

    // 阻止默認的粘貼行為
    event.preventDefault()

    for (const item of imageItems) {
      const file = item.getAsFile()
      if (!file) continue

      await uploadFile(file)
    }
  }

  // 處理拖放事件
  const handleDrop = async (event) => {
    event.preventDefault()

    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(isImageFile)

    if (imageFiles.length === 0) return

    // 設置游標位置到拖放位置
    const textarea = textareaRef.value
    if (textarea) {
      textarea.focus()
      // 這裡可以根據需要計算精確的拖放位置
    }

    for (const file of imageFiles) {
      await uploadFile(file)
    }
  }

  return { handlePaste, handleDrop }
}
