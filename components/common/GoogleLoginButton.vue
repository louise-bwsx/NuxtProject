<template>
  <button :disabled="!isInApp && !isReady" @click="onLoginClick()" class="flex space-x-[8px] items-center">
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
const isInApp = ref(false)

const handleOnSuccess = (response) => {
  console.log(`response.code: ${response.code}`);
  verifyWithBackend({ code: response.code })
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

const onLoginClick = () => {
  if (isInApp.value) {
    // 2026/11/05 呼叫android 原生google登入 網頁google登入會導致白畫面
    window.AndroidBridge.googleLogin()
  } else {
    login()
  }
}

const verifyWithBackend = async (body) => {
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
  // 用!! 可以讓這個 ref 的型態固定是布林
  isInApp.value = !!window.AndroidBridge
  // 避免Hydration node mismatch 將結果存起來
  isLogin.value = authStore.getUserInfo != undefined && !isEmptyObject(authStore.getUserInfo)
  picture.value = isLogin.value ? authStore.getUserInfo.picture : ''
  if (!isLogin.value) {
    anonymousLogin()
  }

  // 給 Android 原生登入完成後呼叫
  window.onNativeGoogleLogin = (idToken) => verifyWithBackend({ idToken: idToken })
  window.onNativeGoogleError = (message) => {
    toastStore.showToast(`Google 登入失敗: ${message}`, "error")
  }
})

onBeforeUnmount(() => {
  delete window.onNativeGoogleLogin
  delete window.onNativeGoogleError
})
</script>
