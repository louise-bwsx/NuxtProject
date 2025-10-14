<template>
  <div class="relative flex flex-col justify-between bg-base-200 h-full">
    <!-- Header -->
    <div class="navbar bg-base-100 shadow-lg border-b border-base-300 h-[65px]">
      <div class="flex-1">
        <div class="flex items-center space-x-3  px-4">
          <div class="flex justify-center items-center text-xl bg-primary text-primary-content rounded-full w-10 h-10">
            AI
          </div>

          <div>
            <h1 class="text-lg font-bold">AI Assistant</h1>
            <p class="text-xs text-base-content/60">Online</p>
          </div>
        </div>
      </div>

      <!-- <div class="flex-none">
        <el-dropdown trigger="click">
          <button class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="aiChat.onDropdownOptionClick('清除對話')">清除對話</el-dropdown-item>
              <el-dropdown-item @click="aiChat.onDropdownOptionClick('匯出對話')">匯出對話</el-dropdown-item>
              <el-dropdown-item @click="aiChat.onDropdownOptionClick('設定')" divided>設定</el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</div> -->
    </div>

    <div class="overflow-y-auto flex-1 px-4 py-6 space-y-10 lg:px-8 h-full">
      <div v-if="aiChat.history.length <= 0" class="flex justify-center h-full">
        <div class="flex flex-col justify-center items-center">
          <div
            class="flex justify-center items-center text-3xl bg-primary text-primary-content rounded-full w-16 h-16 mb-4">
            🤖
          </div>

          <h2 class="text-2xl font-bold mb-2">Hello! 我是 AI 助手</h2>
          <p class="text-base-content/60">有什麼我可以幫助你的嗎？</p>
        </div>
      </div>

      <div v-else v-for="(chatObj, index) in aiChat.history" :key="index">
        <div v-if="index % 2 == 0" class="flex justify-end">
          <div class="flex items-start space-x-3">
            <div class="chat chat-end justify-between">
              <div class="relative chat-bubble chat-bubble-primary w-full mb-3 ">
                <div class="wrap-break-word whitespace-pre-line">{{ chatObj.content.trim() }}</div>
                <div class="absolute right-0 -bottom-6 flex justify-end space-x-3 opacity-50 text-xs">
                  <!-- 編輯按鈕 -->
                  <!-- <button @click="edit" class="w-[14px] h-[14px]">
                    <img src="~/assets/icons/edit_24_24_white.svg" alt="edit">
                  </button> -->

                  <div class="whitespace-nowrap">{{ chatObj.createdAt }}</div>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-end h-full">
              <img v-if="isLogin" :src="picture" class="w-8 h-8 bg-black rounded-full">
              <img v-else src="@/assets/icons/account_40_40_white.svg" class="w-8 h-8 bg-black rounded-full">
            </div>
          </div>
        </div>

        <div v-else class="flex justify-start">
          <div class="flex items-start space-x-3">
            <div class="flex flex-col justify-end h-full">
              <div
                class="flex justify-center items-center text-sm bg-primary text-primary-content rounded-full w-8 h-8">
                AI
              </div>
            </div>

            <div class="chat chat-start w-full justify-between">
              <div class="relative chat-bubble bg-base-100 text-base-content border border-base-300 w-full mb-3">
                <span v-if="isEmptyObject(chatObj)" class="loading loading-dots loading-sm"></span>
                <div v-else>
                  <!-- 20251012 避免連續字無空格 超出chat-bubble 使用wrap-break-word -->
                  <!-- 20251013 避免AI生成的內容無法換行 使用whitespace-pre-line -->
                  <div class="wrap-break-word whitespace-pre-line">{{ chatObj.content.trim() }} </div>
                  <div class="absolute left-0 -bottom-6 flex  space-x-3 opacity-50 text-xs">
                    <div class="flex items-center whitespace-nowrap">{{ chatObj.createdAt }}</div>

                    <button @click="copy" class="w-[14px] h-[14px]">
                      <img src="~/assets/icons/copy_24_24_white.svg" alt="copy">
                    </button>

                    <!-- 收藏按鈕 -->
                    <!-- <button class="w-[14px] h-[14px]">
                      <img src="~/assets/icons/heart_24_24_white.svg" alt="heart">
                    </button> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full bg-base-100 border-t border-base-300 p-4 min-h-[95px]">
      <div class="flex items-end space-x-2 py-2 max-w-4xl mx-auto">
        <!-- 檔案上傳按鈕 -->
        <!-- <button @click="console.log(11)" class="btn btn-ghost btn-circle hidden sm:flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button> -->

        <div class="flex items-center min-h-[40px] flex-1">
          <el-input type="textarea" v-model="aiChat.input" placeholder="輸入訊息... (Shift+Enter 換行)" class="w-full"
            :autosize="{ minRows: 2, maxRows: 12 }" @keydown.enter.exact="aiChat.sendMessage"
            @compositionstart="aiChat.isComposing = true" @compositionend="aiChat.isComposing = false" />
        </div>

        <button @click="aiChat.sendMessage" class="btn btn-primary btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <div class="text-xs text-base-content/50 text-center mt-2 max-w-4xl mx-auto">
        AI 可能會產生不準確的資訊
      </div>
    </div>
  </div>
</template>

<script setup>
const aiChat = useAIChatStore()
const authStore = useAuthStore()

const isLogin = ref(false)
const picture = ref("")
// const isMobile = ref("")

// const onFocus = () => {
//   if (!window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|Android)/i)) {
//     isMobile.value = `isNotMobile`
//     return
//   }
//   isMobile.value = `isMobile`
// }

onMounted(() => {
  isLogin.value = authStore.getUserInfo != undefined && !isEmptyObject(authStore.getUserInfo)
  picture.value = isLogin.value ? authStore.getUserInfo.picture : ''
})
</script>

<style scoped>
@import url("~/assets/css/daisyUI.css");
</style>
