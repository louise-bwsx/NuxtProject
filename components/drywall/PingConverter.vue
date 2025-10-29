<template>
  <div class="bg-white rounded-2xl p-4">
    <div class="flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F64EB"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-home-2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M10 12h4v4h-4z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-800">面積換算</h2>
      <div class="p-3 bg-indigo-50 rounded-lg">
        <p class="text-sm text-gray-600 text-center">
          1 坪 = 3.30579 平方公尺
        </p>
      </div>
    </div>

    <div class="flex space-x-2">
      <div class="flex flex-col space-y-1 w-full">
        <div class="flex items-center">
          <label class="min-w-[65px] text-sm font-medium text-gray-700 whitespace-nowrap">
            坪數:
          </label>
          <el-input type="number" v-model="ping" @change="handlePingChange(ping)" class="w-full text-lg" />
        </div>

        <div class="flex items-center">
          <label class="min-w-[65px] text-sm font-medium text-gray-700 whitespace-nowrap">
            平方公尺:
          </label>
          <el-input type="number" v-model="squareMeter" @change="handleSquareMeterChange(squareMeter)"
            class="w-full text-lg" />
        </div>
      </div>

      <div class="aaa flex items-center">
        <button class="btn h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-down-up">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17 3l0 18" />
            <path d="M10 18l-3 3l-3 -3" />
            <path d="M7 21l0 -18" />
            <path d="M20 6l-3 -3l-3 3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 坪數平方轉換
const ping = ref(0);
const squareMeter = ref(0);

// 坪數 ↔ 平方公尺換算 (1坪 = 3.30579 平方公尺)
const handlePingChange = (value) => {
  ping.value = value
  if (value === '' || isNaN(value)) {
    squareMeter.value = 0;
  } else {
    squareMeter.value = (parseFloat(value) * 3.30579).toFixed(2)
  }
};

const handleSquareMeterChange = (value) => {
  squareMeter.value = value;
  if (value === '' || isNaN(value)) {
    ping.value = 0
  } else {
    ping.value = (parseFloat(value) / 3.30579).toFixed(2)
  }
};
</script>
