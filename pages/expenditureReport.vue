<template>
  <div class="bbb min-h-screen max-h-screen overflow-hidden flex flex-col justify-center items-center">
    <div class="bbb flex flex-col grow w-full">
      <button @click="test()">測試{{ userName }}</button>
      <div class="bbb flex justify-between">
        <!-- https://www.youtube.com/watch?v=SODClEHLeCA -->
        <!-- 如果遇到 [GSI_LOGGER]: The given origin is not allowed for the given client ID. -->
        <!-- 需要在GCP OAuth 2.0用戶端登入 將http:localhost 新增至 已授權的 JavaScript 來源 和 已授權的重新導向 URI -->
        <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" />
        <button class="btn flex-1" @click="showMenu = true">新增</button>
      </div>

      <!-- 沒辦法在畫面顯示 import.meta.env.VITE_BASE_URL 只能用console.log -->
      <!-- <div>env: {{ import.meta.env.VITE_BASE_URL }}</div> -->
    </div>

    <div class="bbb grow w-full overflow-y-auto">
      <!-- 不可以加() 會導致function的element 是undefined -->
      <input type="file" @change="handleFiles" />

      <CSVTable v-if="csvText" :csvText="csvText" />
      <ResponseDataTable v-else />
    </div>
    <MobileInput v-model:showMenu="showMenu" />
    <Toast />
  </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast';
import Toast from "/components/common/Toast"
import ResponseDataTable from "~/components/expenditure/ResponseDataTable.vue";
import MobileInput from "~/components/expenditure/MobileInput.vue";
import CSVTable from "~/components/expenditure/CSVTable.vue";

const csvContent = ref(undefined);
const csvText = ref(undefined);
const showMenu = ref(false)
const userName = ref("")

const test = async () => {
  console.log(`test`)
  // console.log(import.meta.env.BASE_URL); // /_nuxt/
  // console.log(import.meta.env.VITE_BASE_URL); // http://localhost:5001
  // const response = await useApiStore().get("/api/v1/test");
  // console.log(`response: ${JSON.stringify(response)}`)
}

// Google登入成功時呼叫
const handleLoginSuccess = (response) => {
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
  } catch(error) {
    console.log(error.message)
    useToastStore().showToast(`不明原因 登入失敗，請稍後再試: ${error.message}`, "error")
  }
}

const handleFiles = async (element) => {
  const file = element.target.files[0];
  csvText.value = await file.text(); // 讀成文字
};

onMounted(async () => {
  // 讀取csv的做法
  // const res = await fetch('/開銷紀錄.csv');
  // const csvText = await res.text();
  
  // 不要直接在Template使用 useUserInfoStore().getUserInfo.name 會有Hydration Warning
  userName.value = useAuthStore().getUserInfo.name;
});
</script>
