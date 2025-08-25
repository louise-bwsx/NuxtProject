<template>
  <div class="ooo w-screen h-screen overflow-y-auto relative flex flex-col">
    <div class="bbb flex w-full justify-between items-center w-full">
      <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" />
      <button @click="onDeleteClick" class="btn">
        <img src="~/assets/icons/delete_24_24_white.svg" class="w-[24px] h-[24px]">
      </button>
    </div>

    <el-input v-if="isEdit" class="" type="text" v-model="title" placeholder="請輸入標題" clearable size="large" />
    <div v-else class="bbb">{{ title }}</div>

    <div class="bbb">{{ (createDate ? createDate.split("T")[0] : '') }}</div>

    <textarea v-if="isEdit" ref="textareaRef" class="aaa w-full h-full" v-model="content" @paste="handlePaste" @dragover.prevent
      @drop="handleDrop" />
    <div v-else class="aaa markdown-content overflow-y-auto" v-html="renderedContent" />

    <button @click="onVisibilityChange"
      class="fixed bottom-5 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img v-if="isEdit" src="~/assets/icons/edit_24_24_white.svg" class="w-[24px] h-[24px]">
      <img v-else src="~/assets/icons/visibility_24_24_white.svg" class="w-[24px] h-[24px]">
    </button>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const notesStore = useNotesStore()

// Markdown 內容
const content = ref(``)
const uid = ref("0")
const title = ref(``)
const createDate = ref(``)
const updateDate = ref(``)
const isEdit = ref(false)
const textareaRef = ref(null)

// Google登入成功時呼叫
const handleLoginSuccess = (response) => {
  // console.log(`response: ${JSON.stringify(response)}`)
  const { credential } = response;
  // console.log(`credential: ${credential}`)
  verifyTokenWithBackend(credential)
};

// Google登入出現錯誤時呼叫
const handleLoginError = () => {
  useToastStore().showToast("登入失敗", "error")
};

const verifyTokenWithBackend = async (token) => {
  const body = {
    token: token
  }

  try {
    const response = await useApiStore().post("/api/v1/auth/verify", body)
    if (response.code === 0) {
      useAuthStore().setAccessToken(response.data.accessToken)
      useAuthStore().setUserInfo(response.data.userInfo)
      useToastStore().showToast("登入成功", "success")
    } else {
      useToastStore().showToast(`登入失敗: ${response.message}`, "error")
    }
  } catch (error) {
    console.log(error.message)
    useToastStore().showToast(`不明原因 登入失敗，請稍後再試: ${error.message}`, "error")
  }
}

// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 檢查文件是否為圖片
const isImageFile = (file) => {
  return file && file.type && file.type.startsWith('image/')
}

const uploadFile = async (file) => {
  try {
    // 先插入一個占位符
    const placeholder = `![上傳中...](uploading-${file.name})\n`
    insertTextAtCursor(placeholder)

    // 上傳圖片
    // const imageUrl = await uploadImage(file)
    const formData = new FormData()
    formData.append('file', file)
    const response = await useApiStore().post('/api/v1/image', formData);
    const newFileName = response.data.fileName;

    // 替換占位符為實際的圖片鏈接
    const imageName = file.name.replace(/\.[^/.]+$/, '') // 移除副檔名作為 alt text
    const imageMarkdown = `![${imageName}](http://www.louise.tw/static/images/${newFileName})\n`

    // 找到並替換占位符
    const currentContent = content.value
    const placeholderRegex = new RegExp(`!\\[上傳中\\.\\.\\.\\]\\(uploading-[^)]+\\)\\n?`)
    content.value = currentContent.replace(placeholderRegex, imageMarkdown)

  } catch (error) {
    console.error('上傳失敗:', error)
    // 移除占位符
    const currentContent = content.value
    const placeholderRegex = new RegExp(`!\\[上傳中\\.\\.\\.\\]\\(uploading-[^)]+\\)\\n?`)
    content.value = currentContent.replace(placeholderRegex, `<!-- 圖片上傳失敗: ${error.message} -->\n`)

    // 可以添加錯誤提示
    ElMessage.error(`圖片上傳失敗: ${error.message}`)
  }
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

// 處理粘貼事件
const handlePaste = async (event) => {
  const clipboardData = event.clipboardData || window.clipboardData
  if (!clipboardData) return

  const items = Array.from(clipboardData.items)
  const imageItems = items.filter(item => isImageFile(item.getAsFile()))

  if (imageItems.length === 0) return

  // 阻止默認的粘貼行為
  event.preventDefault()

  // 處理每個圖片
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

  // 處理每個圖片文件（與粘貼邏輯相同）
  for (const file of imageFiles) {
    await uploadFile(file)
  }
}

// 顯示md裡面的圖片
const originalImageRender = md.renderer.rules.image
md.renderer.rules.image = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const src = token.attrs[token.attrIndex('src')][1]

  // 為了讓dev production都看到同一個圖片
  if (src.includes('http://localhost:5001')) {
    token.attrs[token.attrIndex('src')][1] = src.replace('http://localhost:5001', import.meta.env.VITE_BASE_URL)
  }

  return originalImageRender ? originalImageRender(tokens, idx, options, env, renderer) : renderer.renderToken(tokens, idx, options)
}

// 計算渲染後的 HTML
const renderedContent = computed(() => {
  return content.value ? md.render(content.value) : ''
})

const onVisibilityChange = () => {
  if (isEdit.value) {
    const body = {
      uid: uid.value,
      title: title.value,
      content: content.value,
    }
    useApiStore().post('/api/v1/notes', body);
  }
  isEdit.value = !isEdit.value
}

const onDeleteClick = () => {
  useApiStore().delete(`/api/v1/notes/${uid.value}`);
}

onMounted(async () => {
  const data = await notesStore.getNote();
  uid.value = data == undefined ? "" : data.uid
  content.value = data == undefined ? "" : data.content
  title.value = data == undefined ? "" : data.title
  createDate.value = data == undefined ? "" : data.createDate
  updateDate.value = data == undefined ? "" : data.updateDate
})
</script>

<style scoped>
@import url("~/assets/css/markdown.css");
</style>