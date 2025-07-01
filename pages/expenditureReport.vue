<template>
  <div class="bbb min-h-screen max-h-screen overflow-hidden flex flex-col justify-center items-center">
    <div class="bbb flex flex-col grow w-full">
      <button v-if="isMobile" @click="test()">測試</button>
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
      <MobileInput v-if="isMobile"/>

    </div>
    <Toast />
  </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast';
import { useWindowSize } from "@vueuse/core";
import Toast from "/components/common/Toast"
import ResponseDataTable from "~/components/expenditure/ResponseDataTable.vue";
import MobileInput from "~/components/expenditure/MobileInput.vue";
import CSVTable from "~/components/expenditure/CSVTable.vue";

const csvContent = ref(undefined);
const csvText = ref(undefined);

const isMobile = computed(() => useWindowSize().width.value < 991)

const test = async () => {
  // console.log(import.meta.env.BASE_URL); // /_nuxt/
  // console.log(import.meta.env.VITE_BASE_URL); // http://localhost:5001
  const response = await useApi().get("/api/v1/test");
  console.log(`response: ${JSON.stringify(response)}`)
}

// Google登入成功時呼叫
const handleLoginSuccess = (response) => {
  const { credential } = response;
  console.log("Access Token", credential);
  // Access Token 
  // eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4MjUwM2E1ZmQ1NmU5ZjczNGRmYmE1YzUwZDdiZjQ4ZGIyODRhZTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTQ4NTkwNjI0MTgtYzdwcjllY2RoYWkwaG10dGtzMG1za2dkaWlvbDRoYXYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTQ4NTkwNjI0MTgtYzdwcjllY2RoYWkwaG10dGtzMG1za2dkaWlvbDRoYXYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDkzNDg5NjE5NjA3MzYxMDkxODQiLCJlbWFpbCI6ImxvdWlzZTg3Mjc2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NTEzNzc2OTcsIm5hbWUiOiLkuJblgpEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTDJvVTdqRzRwVEhJTTd1MFNCQUNNTGNPWHJlVWQ0TmowSkJ0X3dnVXVnX2Fkd3pBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IuS4luWCkSIsImlhdCI6MTc1MTM3Nzk5NywiZXhwIjoxNzUxMzgxNTk3LCJqdGkiOiI5YjUxOGVjZDNhMzlhNjhjNzcwM2NhMDJmNDQ4NjI3NTQ5NTk2NDE0In0.SzwKefll1k5huMY-5YRvI9L3-HVSc23msP8uyYKH87f5V-Da7W01c5fh5tuwAyjIK3deKt_tnBAEm5yZ_TA0nDCQpCwaDpSrhoXoYtii4dn7WEd_HCmuj1A5tcOCqK0Rz57R7Qk9axSa7GIuM8g5rsv0IJlAWmJ6eSRDx87u2HMEqbHdv7DUzbdbrbxY55JEn1qFAI-l37E3Ps3CP5rfGS1s8DWsUTGIlwbhvpyf70gmAopotpbJTOmAGzLS5I_CO2m3k_bxR1v6CQmhiPflvTOFiJ0fZqGg2H2i1oaVTZNCN5GNoMwL4_PwPdsfG0RwNn2SJMPi5kg65cf6p5f6Ig
  useToastStore().showToast("登入成功", "success")
};

// Google登入出現錯誤時呼叫
const handleLoginError = () => {
  useToastStore().showToast("登入失敗", "error")
};

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
