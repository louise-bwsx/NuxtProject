
<template>
  <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" />
</template>

<script setup>
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
</script>