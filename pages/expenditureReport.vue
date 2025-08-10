<template>
  <div class="bbb w-full flex flex-col justify-start items-center">
    <div class="bbb flex w-full justify-between items-center w-full">
      <!-- https://www.youtube.com/watch?v=SODClEHLeCA -->
      <!-- 如果遇到 [GSI_LOGGER]: The given origin is not allowed for the given client ID. -->
      <!-- 需要在GCP OAuth 2.0用戶端登入 將http:localhost 新增至 已授權的 JavaScript 來源 和 已授權的重新導向 URI -->
      <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" />
      <button class="btn flex-1 whitespace-nowrap" @click="test()">測試{{ userName }}</button>
      <button class="btn flex-1 whitespace-nowrap" @click="showSearchInput = !showSearchInput">搜尋</button>
      <button class="btn flex-1 whitespace-nowrap" @click="handleClickAddButton">新增</button>
      <!-- 沒辦法在畫面顯示 import.meta.env.VITE_BASE_URL 只能用console.log -->
      <!-- <div>env: {{ import.meta.env.VITE_BASE_URL }}</div> -->
    </div>
    <SearchInput v-model:showSearchInput="showSearchInput"/>
    <ResponseDataTable />
    <MobileInput v-model:showMenu="showMenu" />
    <Toast />
  </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast';
import ResponseDataTable from "~/components/expenditure/ResponseDataTable.vue";
import MobileInput from "~/components/expenditure/MobileInput.vue";
import SearchInput from '~/components/expenditure/SearchInput.vue';
import Toast from '~/components/common/Toast.vue';

const showSearchInput = ref(false)
const showMenu = ref(false)
const userName = ref("")

const test = async () => {
  console.log(`test`)
  // console.log(import.meta.env.BASE_URL); // /_nuxt/
  // console.log(import.meta.env.VITE_BASE_URL); // http://localhost:5001
  // const response = await useApiStore().get("/api/v1/test");
  // console.log(`response: ${JSON.stringify(response)}`)
}

// TODO: 重做Google登入 改用useTokenClient 或 useCodeClient 因為現在的google登入沒辦法自訂樣式
// 沒辦法用其他button 去觸發實際的GoogleSignInButton 使用useTokenClient 會useCodeClient 後端驗證機制要重做太麻煩了

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
      userName.value = useAuthStore().getUserInfo.name;
      useToastStore().showToast("登入成功", "success")
    } else {
      useToastStore().showToast(`登入失敗: ${response.message}`, "error")
    }
  } catch (error) {
    console.log(error.message)
    useToastStore().showToast(`不明原因 登入失敗，請稍後再試: ${error.message}`, "error")
  }
}

const handleClickAddButton = () => {
  const accessToken = useAuthStore().getAccessToken
  console.log(`isExpire: ${useAuthStore().isExpire(accessToken)}`)
  if (useAuthStore().isExpire(accessToken)) {
    useToastStore().showToast('請重新登入', "error")
    return
  }
  showMenu.value = true
}

onMounted(async () => {
  // 不要直接在Template使用 useUserInfoStore().getUserInfo.name 會有Hydration Warning
  userName.value = useAuthStore().getUserInfo.name;
});
</script>