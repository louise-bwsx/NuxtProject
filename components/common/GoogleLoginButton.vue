<template>
  <button :disabled="!isReady" @click="login()" class="flex space-x-[8px] items-center">
    <img v-if="isLogin && picture != ''" :src="picture" class="w-[40px] h-[40px] bg-black rounded-full">
    <img v-else src="@/assets/icons/account_40_40_white.svg" class="w-[40px] h-[40px] bg-black rounded-full">
  </button>
</template>

<script setup>
import { useCodeClient } from '#imports';
import { useAuthStore } from '#imports';
import { useToastStore } from '#imports';

const authStore = useAuthStore()
const toastStore = useToastStore()

const isLogin = ref(false)
const picture = ref("")

const handleOnSuccess = (response) => {
  console.log(`response.code: ${response.code}`);
  verifyTokenWithBackend(response.code)
};

const handleOnError = (errorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: 'openid profile email',
  redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI
})

const verifyTokenWithBackend = async (code) => {
  const body = {
    code: code
  }

  try {
    const response = await useApiStore().post("/api/v1/auth/verify", body)
    if (response.code === 0) {
      authStore.setAccessToken(response.data.accessToken)
      authStore.setUserInfo(response.data.userInfo)
      // 登入後即時更新
      isLogin.value = true
      picture.value = authStore.getUserInfo.picture
      toastStore.showToast("登入成功", "success")
    } else {
      toastStore.showToast(`登入失敗: ${response.message}`, "error")
    }
  } catch (error) {
    console.log(error.message)
    toastStore.showToast(`不明原因 登入失敗，請稍後再試: ${error.message}`, "error")
  }
}

const anonymousLogin = async () => {
  const response = await useApiStore().post("/api/v1/auth/anonymous")
  if (response.code === 0) {
    authStore.setAccessToken(response.data.accessToken)
    authStore.setUserInfo(response.data.userInfo)
    // 登入後即時更新
    isLogin.value = true
  } else {
    toastStore.showToast(`訪客註冊失敗: ${response.message}`, "error")
  }
}

onMounted(() => {
  // 避免Hydration node mismatch 將結果存起來
  isLogin.value = authStore.getUserInfo != undefined && !isEmptyObject(authStore.getUserInfo)
  picture.value = isLogin.value ? authStore.getUserInfo.picture : ''
  if (!isLogin.value) {
    anonymousLogin()
  }
})
</script>
