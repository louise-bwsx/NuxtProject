<template>
  <div class="bbb min-h-screen max-h-screen overflow-hidden flex flex-col justify-center items-center">
    <div class="bbb flex flex-col grow w-full">
      <button @click="test()">測試</button>
      <!-- <div v-if="content">content.data: {{ content.data }}</div> -->
      <div v-if="csvContent">content.data.length: {{ csvContent.data.length }}</div>
      <div v-if="csvContent">content.data[0].length: {{ csvContent.data[0].length }}</div>

      <!-- TODO: 目前前端會出現兩個Error 是因為GoogleSignInButton的關係 不確定為什麼 -->
      <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" />

      <!-- 沒辦法在畫面顯示 import.meta.env.VITE_BASE_URL 只能用console.log -->
      <!-- <div>env: {{ import.meta.env.VITE_BASE_URL }}</div> -->
    </div>

    <div class="bbb grow w-full overflow-y-auto">
      <!-- 不可以加() 會導致function的element 是undefined -->
      <input type="file" @change="handleFiles" />

      <CSVTable v-if="csvText" :csvText="csvText"/>
      <ResponseDataTable v-else />
      
    </div>
    <MobileInput v-model:showMenu="showMenu"/>
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
const showMenu =ref(false)

const test = async () => {
  // console.log(import.meta.env.BASE_URL); // /_nuxt/
  // console.log(import.meta.env.VITE_BASE_URL); // http://localhost:5001
  // const response = await useApi().get("/api/v1/test");
  // console.log(`response: ${JSON.stringify(response)}`)
  showMenu.value = true
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
    const response = await useApi().post("/api/v1/auth/verify", body)
    if (response.code === 0) {
      localStorage.setItem("accessToken", response.data.accessToken)
      localStorage.setItem("userInfo", response.data.userInfo)
      useToastStore().showToast("登入成功", "success")
    } else {
      useToastStore().showToast(`登入失敗: ${response.message}`, "error")
    }
  } catch {
    useToastStore().showToast(`登入失敗`, "error")
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
});
</script>
