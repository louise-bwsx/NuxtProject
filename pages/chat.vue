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
          <div v-for="group in aiChat.groupList" :key="group.id" @click="selectChat(group.id)" :class="[
            'p-3 rounded-lg cursor-pointer transition-all duration-200',
            aiChat.groupId === group.id
              ? 'bg-[#FAD803]/20 border border-[#6EED00]/80'
              : 'hover:bg-white/5 border border-transparent'
          ]">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium truncate text-sm text-white mb-1">{{ group.title }}</h3>
                <!-- TODO: 時間 -->
                <!-- <p class="text-xs text-[#FAD803] mt-1">{{ group.time }}</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 遮罩層 -->
    <div @click="sidebarOpen = false" class="fixed inset-0 bg-black/60 z-40 transition-all duration-300 ease-out"
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
              <p class="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>

        <!-- 隱身模式切換 -->
        <div class="flex-none">
          <button @click="toggleIncognito" :class="[
            'btn btn-sm',
            isIncognito
              ? 'bg-[#FAD803] hover:bg-[#FAD803]/90 text-[#0d263f] border-none'
              : 'btn-ghost text-gray-400 hover:bg-white/10'
          ]" :title="isIncognito ? '隱身模式：開啟' : '隱身模式：關閉'">
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
            <span class="hidden sm:inline ml-1">{{ isIncognito ? '隱身' : '正常' }}</span>
          </button>
        </div>

      </div>

      <!-- 隱身模式提示條 (absolute 定位) -->
      <!-- 不能使用v-if隱藏 會導致動畫無法播放 -->
      <div
        class="absolute top-[65px] left-0 right-0 bg-[#FAD803]/10 border-b border-[#FAD803]/30 px-4 py-2 flex items-center gap-2 z-20 transition-all duration-300 ease-out pointer-events-none"
        :class="isIncognito ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0'">
        <span class="text-sm text-[#FAD803]">隱身模式已啟用 - 此對話不會被儲存</span>
      </div>

      <!-- 訊息區域 -->
      <div class="overflow-y-auto flex-1 px-4 py-6 space-y-10 lg:px-8 h-full">
        <div v-if="aiChat.history.length <= 0" class="flex justify-center h-full">
          <div class="flex flex-col justify-center items-center">

            <h2 class="text-2xl font-bold mb-2 text-white">Hello! 我是 AI 助手</h2>
            <p class="text-gray-400">有什麼我可以幫助你的嗎？</p>
            <div class="text-xs text-gray-500 text-center mt-2 max-w-4xl mx-auto">
              AI 可能會產生不準確的資訊
            </div>
          </div>
        </div>

        <div v-else v-for="(chatObj, index) in aiChat.history" :key="index">
          <!-- 使用者訊息 -->
          <div v-if="index % 2 == 0" class="flex justify-end">
            <div class="flex items-start space-x-3">
              <div class="chat chat-end justify-between">
                <div class="relative chat-bubble w-full mb-3">
                  <div class="wrap-break-word whitespace-pre-line font-medium">{{ chatObj.content.trim() }}</div>
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
                <div class="relative chat-bubble bg-[#1D232A] w-full mb-3">
                  <span v-if="isEmptyObject(chatObj)" class="loading loading-dots loading-sm"></span>
                  <div v-else>
                    <div class="wrap-break-word whitespace-pre-line">{{ chatObj.content.trim() }}</div>
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
const aiChat = useAIChatStore()

// SEO
usePageSeo({
  title: 'AI 聊天機器人',
  description: '與 Louise AI 即時對話,獲得專業建議',
  url: 'https://www.louise.tw/chat'
})

// 響應式資料
const sidebarOpen = ref(false)
const isIncognito = ref(false)

// 切換隱身模式
const toggleIncognito = () => {
  isIncognito.value = !isIncognito.value
  // 這裡可以加入實際的隱身模式邏輯
  console.log('隱身模式:', isIncognito.value)
}

// 建立新對話
const createNewChat = () => {
  // 這裡加入建立新對話的邏輯
  aiChat.groupId = 0
  aiChat.history = []
  sidebarOpen.value = false
  console.log('建立新對話')
}

// 選擇對話
const selectChat = (groupId) => {
  aiChat.groupId = groupId
  sidebarOpen.value = false
  aiChat.getChatList()
}

onMounted(async () => {
  await aiChat.getAllGroup()
})
</script>

<style scoped>
@import url("~/assets/css/daisyUI.css");

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
</style>
