<template>
  <div class="relative flex h-full bg-[#191E24]">
    <!-- 側邊欄 -->
    <div :class="[
      'fixed inset-y-0 left-0 z-50 w-80 bg-[#1D232A] border-r border-[#6EED00]/80 transition-all duration-300 ease-out',
      sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    ]">
      <!-- 側邊欄頭部 -->
      <div class="p-4 border-b border-[#6EED00]/80">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">對話歷史</h2>
          <button @click="sidebarOpen = false" class="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 新對話按鈕 -->
        <button @click="createNewChat" class="w-full btn border-none font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新對話
        </button>
      </div>

      <!-- 對話歷史列表 -->
      <div class="overflow-y-auto h-[calc(100vh-140px)] p-3">
        <div class="space-y-2">
          <div v-for="group in aiChat.groupList" :key="group.id" @click="!editingId && selectChat(group.id)" :class="[
            'group p-3 rounded-lg cursor-pointer transition-all duration-200 relative',
            aiChat.groupId === group.id
              ? 'bg-[#FAD803]/20 border border-[#6EED00]/80'
              : 'hover:bg-white/5 border border-transparent'
          ]">
            <div class="flex items-center justify-between gap-2">
              <div class="flex-1 min-w-0">
                <!-- 編輯模式：顯示 Element Plus Input -->
                <el-input v-if="editingId === group.id" v-model="editingTitle" size="small" ref="editInputRef"
                  class="edit-input" @keyup.enter="confirmEdit(group)" @keyup.esc="cancelEdit" @blur="cancelEdit"
                  @click.stop />
                <!-- 一般模式：顯示標題 -->
                <h3 v-else class="font-medium truncate text-sm text-white h-[26.5px] flex items-center">
                  {{ group.title }}
                </h3>
              </div>

              <!-- ── 手機版（≤ sm）：三點更多按鈕 + Dropdown ── -->
              <div v-if="editingId !== group.id" class="relative sm:hidden shrink-0" @click.stop>
                <button @click="toggleMenu(group.id)"
                  class="p-1 rounded text-white hover:bg-white/10 transition-colors duration-150" title="更多">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 640 640">
                    <path fill="rgb(255,255,255)"
                      d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z" />
                  </svg>
                </button>

                <!-- Dropdown 選單 -->
                <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                  <div v-if="activeMenuId === group.id"
                    class="absolute right-0 top-7 z-50 w-32 bg-[#252D36] border border-[#6EED00]/50 rounded-lg shadow-xl overflow-hidden">
                    <!-- 編輯 -->
                    <button @click="startEdit(group); activeMenuId = null"
                      class="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#FAD803]" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      編輯
                    </button>
                    <!-- 刪除 -->
                    <button @click="openDeleteDialog(group); activeMenuId = null"
                      class="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      刪除
                    </button>
                  </div>
                </transition>
              </div>

              <!-- ── 桌面版（> sm）：hover 顯示編輯 / 刪除按鈕 ── -->
              <div v-if="editingId !== group.id"
                class="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                @click.stop>
                <!-- 編輯按鈕 -->
                <button @click="startEdit(group)"
                  class="p-1 rounded text-white hover:text-[#FAD803] hover:bg-white/10 transition-colors duration-150"
                  title="編輯">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                <!-- 刪除按鈕 -->
                <button @click="openDeleteDialog(group)"
                  class="p-1 rounded text-white hover:text-red-400 hover:bg-white/10 transition-colors duration-150"
                  title="刪除">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- TODO: 時間 -->
            <!-- <p class="text-xs text-[#FAD803]">{{ group.time }} 2025/2</p> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 遮罩層（同時關閉 dropdown） -->
    <div @click="sidebarOpen = false; activeMenuId = null"
      class="fixed inset-0 bg-black/60 z-40 transition-all duration-300 ease-out"
      :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" />

    <!-- 主要內容區域 -->
    <div class="flex flex-col flex-1 h-full">
      <!-- Header -->
      <div class="navbar bg-[#1D232A] shadow-lg z-30">
        <div class="flex-1">
          <div class="flex items-center space-x-3">
            <!-- 漢堡選單按鈕 -->
            <button @click="sidebarOpen = true" class="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 class="text-lg font-bold text-white">AI Assistant</h1>
              <p class="text-xs text-gray-400">{{ aiChat.isOnline ? 'Online' : 'Offline' }}</p>
            </div>
          </div>
        </div>

        <!-- 隱身模式切換 -->
        <div v-if="aiChat.history.length <= 0" class="flex-none">
          <button @click="aiChat.toggleIncognito()" :class="[
            'btn btn-sm',
            aiChat.isIncognito
              ? 'bg-[#FAD803] hover:bg-[#FAD803]/90 text-[#0d263f] border-none'
              : 'btn-ghost text-gray-400 hover:bg-white/10'
          ]" :title="aiChat.isIncognito ? '隱身模式：開啟' : '隱身模式：關閉'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-spy">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 11h18" />
              <path d="M5 11v-4a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v4" />
              <path d="M4 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M10 17h4" />
            </svg>
            <span class="hidden sm:inline ml-1">{{ aiChat.isIncognito ? '隱身' : '正常' }}</span>
          </button>
        </div>

      </div>

      <!-- 隱身模式提示條 -->
      <!-- 不能使用v-if隱藏 會導致動畫無法播放 -->
      <div v-if="aiChat.isIncognito"
        class="absolute top-[65px] left-0 right-0 bg-[#FAD803]/10 border-b border-[#FAD803]/30 px-4 py-2 flex items-center gap-2 z-20 transition-all duration-300 ease-out pointer-events-none"
        :class="aiChat.isIncognito ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0'">
        <span class="text-sm text-[#FAD803]">隱身模式已啟用 - 此對話不會被儲存</span>
      </div>

      <!-- 訊息區域 -->
      <div class="overflow-y-auto flex-1 px-4 py-6 space-y-10 lg:px-8 h-full">
        <div v-if="aiChat.history.length <= 0" class="flex justify-center h-full">
          <div class="flex flex-col justify-center items-center">

            <h2 v-if="aiChat.isOnline" class="text-2xl font-bold mb-2 text-white">Hello! 我是 AI 助手</h2>
            <h2 v-else class="text-2xl font-bold mb-2 text-white">AI 助手 休眠中</h2>
            <p v-if="aiChat.isOnline" class="text-gray-400">有什麼我可以幫助你的嗎？</p>
            <div v-if="aiChat.isOnline" class="text-xs text-gray-500 text-center mt-2 max-w-4xl mx-auto">
              AI 可能會產生不準確的資訊
            </div>
          </div>
        </div>

        <div v-else v-for="(chatObj, index) in aiChat.history" :key="index">
          <!-- 使用者訊息 -->
          <div v-if="index % 2 == 0" class="flex justify-end">
            <div class="flex items-start space-x-3">
              <div class="chat chat-end justify-between">
                <div class="relative chat-bubble w-full">
                  <!-- 20260220 在只有一行文字的情況下 會導致底下留很多空格 所以刪掉whitespace-pre-line -->
                  <div class="wrap-break-word font-medium markdown-content"
                    v-html="renderedContent(chatObj.content.trim())" />
                  <div class="absolute right-0 -bottom-6 flex justify-end space-x-3 opacity-50 text-xs">
                    <button @click="copy(chatObj.content.trim())"
                      class="w-[14px] h-[14px] hover:opacity-100 transition-opacity">
                      <img src="~/assets/icons/copy_24_24_white.svg" alt="copy">
                    </button>
                    <div class="whitespace-nowrap text-gray-400">{{ chatObj.createdAt }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 訊息 -->
          <div v-else class="flex justify-start">
            <div class="flex items-start space-x-3">
              <div class="chat chat-start w-full justify-between">
                <div class="relative chat-bubble bg-[#1D232A] w-full">
                  <span v-if="isEmptyObject(chatObj) || chatObj.content == ``"
                    class="loading loading-dots loading-sm" />
                  <div v-else>
                    <!-- 20260220 在只有一行文字的情況下 會導致底下留很多空格 所以刪掉whitespace-pre-line -->
                    <div class="wrap-break-word markdown-content" v-html="renderedContent(chatObj.content.trim())" />
                    <div class="absolute left-0 -bottom-6 flex space-x-3 opacity-50 text-xs">
                      <div class="flex items-center whitespace-nowrap text-gray-400">{{ chatObj.createdAt }}</div>

                      <button @click="copy(chatObj.content.trim())"
                        class="w-[14px] h-[14px] hover:opacity-100 transition-opacity">
                        <img src="~/assets/icons/copy_24_24_white.svg" alt="copy">
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 輸入區域 -->
      <div class="w-full bg-base-100 border-t border-base-300 p-4">
        <div class="flex items-center space-x-2 max-w-4xl mx-auto">
          <div class="flex items-center min-h-[40px] flex-1">
            <el-input type="textarea" v-model="aiChat.input" placeholder="輸入訊息... (Shift+Enter 換行)"
              class="w-full gumroad-input" :autosize="{ minRows: 1, maxRows: 12 }"
              @keydown.enter="aiChat.sendMessage" />
          </div>

          <button @click="aiChat.sendMessage"
            class="btn bg-[#1D232A] border border-[#6EED00]/80 hover:bg-[#FAD803]/90 text-white btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const aiChat = useAIChatStore()

// SEO
usePageSeo({
  title: 'AI 聊天機器人',
  description: '與 Louise AI 即時對話,獲得專業建議',
  url: 'https://www.louise.tw/chat'
})

// 響應式資料
const sidebarOpen = ref(true)
// 編輯狀態
const editingId = ref(null)
const editingTitle = ref(``)
const editInputRef = ref(null)
// 手機版更多選單
const activeMenuId = ref(null)

// 切換更多選單（點同一個就關閉）
const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

// 點擊頁面其他地方關閉選單
const handleClickOutside = () => {
  activeMenuId.value = null
}

// 建立新對話
const createNewChat = () => {
  aiChat.groupId = 0
  aiChat.history = []
  sidebarOpen.value = false
  console.log('建立新對話')
}

// 選擇對話
const selectChat = (groupId) => {
  aiChat.groupId = groupId
  sidebarOpen.value = false
  aiChat.toggleIncognito()
  aiChat.getChatList()
}

// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 計算渲染後的 HTML
const renderedContent = (content) => {
  return content ? md.render(content) : ''
}

// 開始編輯
const startEdit = async (group) => {
  editingId.value = group.id
  editingTitle.value = group.title
  await nextTick()
  const inputEl = Array.isArray(editInputRef.value)
    ? editInputRef.value[0]
    : editInputRef.value
  inputEl?.focus()
}

// 取消編輯
const cancelEdit = () => {
  editingId.value = null
  editingTitle.value = ``
}

// 確認編輯：Enter 後呼叫 store 更新
const confirmEdit = async (group) => {
  const newTitle = editingTitle.value.trim()
  if (!newTitle || newTitle === group.title) {
    cancelEdit()
    return
  }
  await aiChat.updateGroupTitle(group.id, newTitle)
  cancelEdit()
}

// 開啟刪除確認彈窗
const openDeleteDialog = (group) => {
  ElMessageBox.confirm(
    `確定要刪除「${group.title}」嗎？此操作無法復原。`,
    `刪除確認`,
    {
      confirmButtonText: `刪除`,
      cancelButtonText: `取消`,
      type: `warning`,
      confirmButtonClass: `el-button--danger`,
    }
  )
    .then(async () => {
      await aiChat.deleteGroup(group.id)
    })
    .catch(() => {
      // 使用者取消，不做任何事
    })
}

onMounted(async () => {
  await aiChat.getAllGroup()
  await aiChat.getStatus()
  // 點擊空白處關閉 dropdown
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url("~/assets/css/daisyUI.css");
@import url("~/assets/css/markdown.css");

/* Gumroad 風格自訂樣式 */
:deep(.gumroad-input .el-textarea__inner) {
  background-color: #191E24;
  border: 1px solid rgb(118, 255, 0, 0.8);
  color: white;
  border-radius: 0.35rem;
  padding: 0.75rem;
  transition: all 0.2s;
  box-shadow: none;
}

:deep(.gumroad-input .el-textarea__inner:focus) {
  border-color: #FAD803;
  box-shadow: 0 0 0 3px rgba(250, 216, 3, 0.1);
}

:deep(.gumroad-input .el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

/* 側邊欄修改title的input */
:deep(.edit-input .el-input__wrapper) {
  box-shadow: 0 0 0 1px #6EED00 inset;
}

:deep(.edit-input .el-input__inner) {
  color: #ffffff;
  font-size: 0.875rem;
  height: 24px;
}
</style>
