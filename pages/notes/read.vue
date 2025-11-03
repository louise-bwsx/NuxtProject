<template>
  <!-- 20251013 從h-screen改成h-full 避免出現窗雙重卷軸 -->
  <div class="w-screen h-full overflow-y-auto relative flex flex-col">
    <div v-if="currentMode == 'edit' || currentMode == 'split'">
      <el-input type="text" v-model="title" placeholder="請輸入標題" clearable size="large" />
      <el-input-tag v-model="tags" placeholder="請輸入標籤" size="large" @add-tag="onAddTag" @remove-tag="onRemoveTag" />
    </div>

    <div v-else-if="title" class="border-s border-b border-e border-black">
      <div class="flex justify-between items-start px-4 py-1 border-b border-black">
        <div class="text-lg font-semibold">{{ title }}</div>
      </div>

      <div v-if="createDate" class="flex space-x-1 items-center px-4 py-1 border-b border-black">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
          <path
            d="M216-96q-29.7 0-50.85-21.5Q144-139 144-168v-528q0-29 21.15-50.5T216-768h72v-96h72v96h240v-96h72v96h72q29.7 0 50.85 21.5Q816-725 816-696v528q0 29-21.15 50.5T744-96H216Zm0-72h528v-360H216v360Zm0-432h528v-96H216v96Zm0 0v-96 96Z" />
        </svg>
        <div class="text-xs whitespace-nowrap">
          {{ createDate.split("T")[0] }}
        </div>
      </div>

      <!-- 20251103 使用space-y-[4px]會和flex-wrap衝突 導致最後一個tag會比較大 改用gap-[4px] -->
      <div v-if="tags" class="flex w-full gap-[4px] flex-wrap px-4 py-1">
        <div v-for="tag in tags" :key="tag"
          class="flex items-center space-x-[6px] px-2.5 py-1 rounded-full text-xs font-medium aaa">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-tag">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path
              d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z" />
          </svg>

          <div>{{ tag }}</div>
        </div>
      </div>
    </div>

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
import { deleteNote, createNote, saveNote, postView, postTag } from '~/api/notes'

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
const tags = ref([])
// 用於追蹤已存在的標籤，避免重複
const existingTags = ref(new Set())

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

const onAddTag = async (tag) => {
  // 檢查是否重複
  if (existingTags.value.has(tag)) {
    // 移除剛剛加入的重複標籤
    const index = tags.value.lastIndexOf(tag)
    if (index > -1) {
      tags.value.splice(index, 1)
    }
    return
  }

  // 呼叫 API
  await postTag(uid.value, tag, 'Add')

  // 加入到已存在集合
  existingTags.value.add(tag)
}

const onRemoveTag = async (tag) => {
  // 呼叫 API
  await postTag(uid.value, tag, 'Remove')

  // 從已存在集合移除
  existingTags.value.delete(tag)
}

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
  tags.value = data == undefined ? "" : data.tags

  // 避免新增筆記時觸發增加觀看數 導致出現ErrorToast
  if (uid.value != "") {
    await postView(uid.value, useAuthStore().getUserInfo.id)
  }
})
</script>

<style scoped>
@import url("~/assets/css/markdown.css");
</style>
