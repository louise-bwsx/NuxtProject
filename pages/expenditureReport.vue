<template>
  <div class="bbb min-h-screen max-h-screen overflow-hidden flex flex-col justify-center items-center">
    <div class="bbb flex flex-col grow w-full">
      <button @click="handleSaveDay(1)">handleSaveDay測試</button>
      <button @click="test()">測試</button>
      <div>lastDayOfMonth: {{ lastDayOfMonth }}</div>
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

      <CSVTable v-if="csvContent" />
      <ResponseDataTable v-else />

    </div>
    <Toast />
  </div>
</template>

<script setup>
import Toast from "/components/common/Toast"
import { useToastStore } from '~/stores/toast';
import ResponseDataTable from "~/components/expenditure/ResponseDataTable.vue";
import CSVTable from "~/components/expenditure/CSVTable.vue";

const csvContent = ref(undefined);
const lastDayOfMonth = ref(0);

const expenditureList = ref(undefined)

const test = async () => {
  // console.log(import.meta.env.BASE_URL); // /_nuxt/
  // console.log(import.meta.env.VITE_BASE_URL); // http://localhost:5001
  // const response = await useApi().get("/api/v1/test");
}

// Google登入成功時呼叫
const handleLoginSuccess = (response) => {
  const { credential } = response;
  console.log("Access Token", credential);
  useToastStore().showToast("登入成功", "success")
};

// Google登入出現錯誤時呼叫
const handleLoginError = () => {
  useToastStore().showToast("登入失敗", "error")
};

const handleFiles = async (element) => {
  console.log(element)
  const file = element.target.files[0];
  const csvText = await file.text(); // 讀成文字
  parseExpenditureCsvData(csvText)
};

onMounted(async () => {
  // 讀取csv的做法
  // const res = await fetch('/開銷紀錄.csv');
  // const csvText = await res.text();
  // parseExpenditureCsvData(csvText)
});
</script>
