<template>
  <div class="bg-white rounded-2xl p-4">
    <div class="flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F64EB"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-ruler-2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17 3l4 4l-14 14l-4 -4z" />
        <path d="M16 7l-1.5 -1.5" />
        <path d="M13 10l-1.5 -1.5" />
        <path d="M10 13l-1.5 -1.5" />
        <path d="M7 16l-1.5 -1.5" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-800">長度換算</h2>

      <div class="p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-gray-600 text-center">
          1 台尺 = 30.303 公分
        </p>
      </div>
    </div>

    <div class="flex space-x-2">
      <div class="flex flex-col space-y-1 w-full">
        <div class="flex items-center">
          <div class="min-w-[65px] text-md font-medium text-gray-700 whitespace-nowrap">
            台尺:
          </div>
          <el-input type="number" v-model="taiwanFoot" @change="handleTaiwanFootChange(taiwanFoot)"
            class="w-full text-lg" />
        </div>

        <div class="flex items-center">
          <label class="min-w-[65px] text-md font-medium text-gray-700 whitespace-nowrap">
            公分:
          </label>
          <el-input type="number" v-model="centimeter" @change="handleCentimeterChange(centimeter)"
            class="w-full text-lg" />
        </div>
      </div>

      <div class="flex items-center">
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
// 台尺公分轉換
const taiwanFoot = ref(0);
const centimeter = ref(0);

// 台尺 ↔ 公分換算 (1台尺 = 30.303 公分)
const handleTaiwanFootChange = (value) => {
  taiwanFoot.value = value
  if (value === '' || isNaN(value)) {
    centimeter.value = 0;
  } else {
    centimeter.value = (parseFloat(value) * 30.303).toFixed(2)
  }
};

const handleCentimeterChange = (value) => {
  centimeter.value = value
  if (value === '' || isNaN(value)) {
    taiwanFoot.value = 0;
  } else {
    taiwanFoot.value = (parseFloat(value) / 30.303).toFixed(3)
  }
};
</script>
