<template>
  <div class="ooo w-screen min-h-screen overflow-y-scroll relative">
    <div class="bbb flex w-full justify-between items-center w-full">
      <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" />
    </div>

    <el-input v-if="isEdit" class="" type="text" v-model="title" placeholder="請輸入標題" clearable size="large" />

    <textarea v-if="isEdit" class="bbb w-full h-full p-[20px]" v-model="content" />
    <div v-else class="aaa markdown-content" v-html="renderedContent" />

    <button @click="onVisibilityChange"
      class="fixed bottom-5 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img v-if="isEdit" src="~/assets/icons/edit_24_24_white.svg" class="w-[24px] h-[24px]">
      <img v-else src="~/assets/icons/visibility_24_24_white.svg" class="w-[24px] h-[24px]">
    </button>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

// Markdown 內容
const content = ref(``)
const title = ref(``)
const isEdit = ref(true)

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
  return md.render(content.value)
})

const onVisibilityChange = () => {
  if (isEdit.value) {
    const body = {
      title: title.value,
      content: content.value,
    }
    useApiStore().post('/api/v1/notes/', body);
  }
  isEdit.value = !isEdit.value
}
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