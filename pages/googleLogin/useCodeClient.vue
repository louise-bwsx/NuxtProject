
<template>
  <button class="bbb" :disabled="!isReady" @click="() => login()">Login with Google</button>
</template>

<script setup>
import { useCodeClient } from '#imports';

const handleOnSuccess = (response) => {
  console.log(`response.code: ${response.code}`);
  verifyTokenWithBackend(response.code)
};

const handleOnError = (errorResponse) => {
  console.log("Error: ", errorResponse);
};

const {isReady, login} = useCodeClient({
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
</script>