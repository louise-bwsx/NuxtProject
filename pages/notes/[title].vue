<template>
  <div class="ooo w-screen">
    <div class="markdown-content" v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const notesStore = useNotesStore()
// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 你的 Markdown 內容（之後可以從 API 獲取）
const content = ref(``)

// 計算渲染後的 HTML
const renderedContent = computed(() => {
  return md.render(content.value)
})

// 模擬從 API 更新內容的函數
const updateContent = (newContent) => {
  content.value = newContent
}

// 如果你要從 API 獲取內容，可以這樣做：
// const { data: apiContent } = await $fetch('/api/notes')
// if (apiContent) {
//   content.value = apiContent
// }

onMounted(async() => {
  const data = await notesStore.getNote();
  content.value = data == undefined ? "" : data.content
})
</script>

<style scoped>
.markdown-content {
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 標題樣式 */
.markdown-content :deep(h1) {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
  /* color: #1f2937; */
}

.markdown-content :deep(h2) {
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  /* color: #374151; */
}

.markdown-content :deep(h3) {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  /* color: #4b5563; */
}

/* 段落和文字 */
.markdown-content :deep(p) {
  margin-bottom: 1rem;
  /* color: #374151; */
}

.markdown-content :deep(strong) {
  font-weight: 600;
  /* color: #1f2937; */
}

.markdown-content :deep(em) {
  font-style: italic;
  /* color: #6b7280; */
}

/* 列表 */
.markdown-content :deep(ul) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
  /* color: #374151; */
}

/* 程式碼 inline code */
.markdown-content :deep(code) {
  background-color: #1F2C2E;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  /* color: #dc2626; */
}

/* 程式碼區塊 */
.markdown-content :deep(pre) {
  background-color: #1f2937;
  /* color: #f9fafb; */
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  /* color: #f9fafb; */
}

/* 引用 */
.markdown-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

/* 連結 */
.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown-content :deep(a:hover) {
  color: #1d4ed8;
}
</style>