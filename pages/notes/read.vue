<template>
  <!-- 20251013 從h-screen改成h-full 避免出現窗雙重卷軸 -->
  <div class="w-screen h-full overflow-y-auto relative flex flex-col">
    <el-input v-if="currentMode == 'edit' || currentMode == 'split'" class="" type="text" v-model="title"
      placeholder="請輸入標題" clearable size="large" />
    <div v-else-if="title" class="aaa">{{ title }}</div>

    <div v-if="createDate" class="aaa">{{ createDate.split("T")[0] }}</div>

    <textarea v-if="currentMode == 'edit'" ref="textareaRef" class=" outline-none w-full h-full" v-model="content"
      @paste="handlePaste" @dragover.prevent @drop="handleDrop" />

    <!-- 20251001 使用flex-1佔滿剩餘空間 加上overflow-hidden避免在水平分割時 出現多餘的捲軸 -->
    <div v-else-if="currentMode == 'split'" class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <textarea ref="textareaRef" class="outline-none resize-none w-full lg:w-1/2 h-[50dvh] lg:h-full aaa"
        v-model="content" @paste="handlePaste" @dragover.prevent @drop="handleDrop" />
      <div class="markdown-content overflow-y-auto w-full lg:w-1/2 h-[50dvh] lg:h-full aaa" v-html="renderedContent" />
    </div>

    <div v-else class="markdown-content overflow-y-auto" v-html="renderedContent" />

    <button @click="onDeleteClick"
      class="fixed bottom-20 left-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="~/assets/icons/delete_24_24_white.svg" class="w-[24px] h-[24px]">
    </button>

    <button @click="onVisibilityClick"
      class="fixed bottom-20 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img v-if="currentMode == 'edit'" src="~/assets/icons/edit_24_24_white.svg" class="w-[24px] h-[24px]">
      <img v-else src="~/assets/icons/visibility_24_24_white.svg" class="w-[24px] h-[24px]">
    </button>

    <button @click="onSplitClick"
      class="fixed bottom-35 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="~/assets/icons/splitVertical_24_24_white.svg" class="hidden lg:flex w-[24px] h-[24px]">
      <img src="~/assets/icons/splitHorizontal_24_24_white.svg" class="lg:hidden w-[24px] h-[24px]">
    </button>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import { useRoute } from 'vue-router'
import { deleteNote, createNote, saveNote, postView } from '~/api/notes'

const notesStore = useNotesStore()
const route = useRoute()
const router = useRouter()

// Markdown 內容
const content = ref(``)
const uid = ref("")
const title = ref(``)
const createDate = ref(``)
const updateDate = ref(``)
const textareaRef = ref(null)
const currentMode = ref(`view`) // split, edit

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
    if (response.code === 0) {
      useToastStore().showToast("上傳成功", "success")
    } else {
      useToastStore().showToast(`上傳失敗: ${response.message}`, "error")
    }
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

const onVisibilityClick = async () => {
  if (currentMode.value == 'edit') {
    // 20251006 補上createNote 為了解決新增筆記時 同一個筆記會被新增很多次 post不再有put的功能
    // 沒有uid代表是新增
    if (uid.value == "" || uid.value == undefined) {
      const response = await createNote(title.value, content.value);
      uid.value = response.data.lastInsertID
      return;
    }

    // 20251006 後端只吃int64 不確定為什麼沒辦法用json 所以用struct
    await saveNote(+uid.value, title.value, content.value);
  }

  currentMode.value = currentMode.value == 'edit' ? 'view' : 'edit'
  route.query.mode = currentMode.value

  const newQuery = { ...route.query }

  if (currentMode.value == 'edit') {
    newQuery.mode = 'edit'
  } else {
    delete newQuery.mode // 移除參數而不是設為 false
  }

  await router.replace({
    query: newQuery
  })
}

const onSplitClick = async () => {
  currentMode.value = 'split'

  // 20251101 修正新建筆記時沒辦法透過split進行儲存
  // 沒有uid代表是新增
  if (uid.value == "" || uid.value == undefined) {
    const response = await createNote(title.value, content.value);
    uid.value = response.data.lastInsertID
    return;
  }

  // 20251006 後端只吃int64 不確定為什麼沒辦法用json 所以用struct
  await saveNote(+uid.value, title.value, content.value);
}

const onDeleteClick = async () => {
  // 20251006 後端只吃int64 不確定為什麼沒辦法用json 所以用struct
  await deleteNote(+uid.value);
  await notesStore.resetLoadingState()
  router.push('/notes')
}

onMounted(async () => {
  currentMode.value = route.query.mode == undefined ? 'view' : route.query.mode

  const data = await notesStore.getNote();
  uid.value = data == undefined ? "" : data.uid
  content.value = data == undefined ? "" : data.content
  title.value = data == undefined ? "" : data.title
  createDate.value = data == undefined ? "" : data.createDate
  updateDate.value = data == undefined ? "" : data.updateDate

  await postView(uid.value, useAuthStore().getUserInfo.id)
})
</script>

<style scoped>
@import url("~/assets/css/markdown.css");
</style>
