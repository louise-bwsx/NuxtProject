<template>
  <div class="flex flex-col mx-auto w-full h-full space-y-4 p-6 overflow-hidden aaa">
    <div class="text-lg font-semibold flex items-center">上次更新時間 {{ formattedLastRefreshTime }}</div>

    <button @click="resetSort" class="btn px-4 py-2">清除存檔排序</button>

    <div ref="currencyListRef" class="flex-1 overflow-auto">
      <div v-for="rate in convertedRates" :key="rate.key"
        class="flex w-full justify-between items-center border-b py-3 relative">
        <div class="flex space-x-4 ps-3">
          <!-- 20251101 修正手機無法上下捲動 加上drag-handle -->
          <div class="drag-handle cursor-move flex items-center">
            <!-- tabler icons -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-grip-vertical">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            </svg>
          </div>
          <img :src="getFlagSrc(rate.key)" :alt="rate.key" class="w-[32px] h-[32px]">
          <div class="text-lg font-semibold flex items-center">{{ currencyCNMap[rate.key] }}</div>
        </div>

        <div class="text-lg font-semibold flex items-center absolute left-[50%]">{{ rate.key }}</div>

        <div class="text-lg font-semibold flex items-center pe-3">
          {{ (rate.convertedValue * amount).toFixed(2) }}
        </div>
      </div>
    </div>

    <div class="flex space-x-2">
      <div class="w-[150px]">
        <select v-model="selectedCurrency" class="w-full h-full px-1">
          <option v-for="([code, name]) in Object.entries(currencyCNMap)" :key="code" :value="name">
            {{ name }}
          </option>
        </select>
      </div>

      <el-input type="number" v-model="amount" placeholder="請輸入金額" clearable size="large" />
    </div>
  </div>
</template>

<script setup>
import { useDraggable } from "vue-draggable-plus";

const dateTimeStore = useDateTimeStore()

const amount = ref(1)
const selectedCurrency = ref("台幣")
const rates = ref([])

const flagImages = import.meta.glob('@/assets/images/flag/*.png', { eager: true, import: 'default' })
const commonCurrencies = [
  'TWD',
  'USD',
  'JPY',
  'HKD',
  'AUD',
  'NZD',
  'PHP',
  'EUR',
  'KRW',
  'CNY',
  'GBP',
  'CAD',
  'CHF',
  'ZAR',
  'SEK',
  'SGD',
  'THB',
  'IDR',
  'VND',
  'MYR',
]
const currencyCNMap = {
  TWD: '台幣', USD: '美金', HKD: '港幣', AUD: '澳幣', GBP: '英鎊', CAD: '加拿大幣', SGD: '新加坡幣', CHF: '瑞士法郎', JPY: '日圓', ZAR: '南非幣', SEK: '瑞典幣', NZD: '紐元', THB: '泰幣', PHP: '菲國比索', IDR: '印尼幣', EUR: '歐元', KRW: '韓元', VND: '越南盾', MYR: '馬來幣', CNY: '人民幣',
}
const lastRefreshTime = ref("")
const formattedLastRefreshTime = ref("")
const FIVE_MINUTES = 5 * 60 * 1000 // 5 分鐘的毫秒數
const sortedKeys = ref([...commonCurrencies]) // 初始順序與 commonCurrencies 一樣

// 拖曳相關
const currencyListRef = ref();
const draggable = ref();
watch(
  currencyListRef,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      draggable.value = useDraggable(currencyListRef, sortedKeys.value, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: () => {
          localStorage.setItem('sortedKeys', JSON.stringify(sortedKeys.value))
        }
      })
    }
  },
  { immediate: true }
)

watch(
  selectedCurrency,
  () => {
    localStorage.setItem("selectedCurrency", selectedCurrency.value)
  }
)

const selectedCurrencyCode = computed(() => {
  return Object.keys(currencyCNMap).find(key => currencyCNMap[key] === selectedCurrency.value) || 'USD'
})

const sortedRates = computed(() => {
  return sortedKeys.value
    .map(key => rates.value.find(rate => rate.key === key))
    .filter(Boolean) // 避免 null
})

const convertedRates = computed(() => {
  const selectedKey = selectedCurrencyCode.value
  const selectedRate = Number(rates.value.find(r => r.key === selectedKey)?.value || 1)

  return sortedRates.value.map(rate => ({
    ...rate,
    convertedValue: (Number(rate.value) / selectedRate).toFixed(2),
  }))
})

const refreshCurrency = async () => {
  const resp = await $fetch(`https://api.coinbase.com/v2/exchange-rates`)

  const allRates = resp.data.rates

  // 按照 commonCurrencies 的順序來組出 rates
  rates.value = commonCurrencies
    .filter(key => key in allRates)
    .map(key => ({ key, value: allRates[key] }))

  saveRefreshTime()
  localStorage.setItem("rates", JSON.stringify(rates.value))
}

const saveRefreshTime = () => {
  const now = dateTimeStore.now()
  //20251013 取消now.toLocaleString now.toISOString 因為now的回傳值更改了
  lastRefreshTime.value = now
  localStorage.setItem("formattedLastRefreshTime", now)
  localStorage.setItem("lastRefreshTime", now)
}

const resetSort = () => {
  sortedKeys.value.splice(0, sortedKeys.value.length, ...commonCurrencies)
  localStorage.removeItem('sortedKeys')
}

const getFlagSrc = (currencyCode) => {
  const key = currencyCode.toLowerCase()
  return flagImages[`/assets/images/flag/ic_flag_${key}.png`] || ''
}

onMounted(async () => {
  const storedCurrency = localStorage.getItem('selectedCurrency')
  if (storedCurrency == null || storedCurrency == "null") {
    selectedCurrency.value = "台幣"
  } else {
    selectedCurrency.value = storedCurrency
  }

  const storedKeys = localStorage.getItem('sortedKeys')
  if (storedKeys) {
    sortedKeys.value = JSON.parse(storedKeys)
  }

  // 改用 new Date() 取得當前時間的 Date 物件
  const now = new Date()
  formattedLastRefreshTime.value = localStorage.getItem("formattedLastRefreshTime")
  console.log(`formattedLastRefreshTime: ${formattedLastRefreshTime.value}`)
  const last = localStorage.getItem("lastRefreshTime")

  if (last === null) {
    await refreshCurrency()
    return;
  }

  const lastDate = new Date(last)
  const diff = now - lastDate
  // 20250630 louise 避免舊版錯誤 導致不更新資料 新增Number.isNaN()
  if (diff > FIVE_MINUTES || Number.isNaN(diff)) {
    await refreshCurrency()
    return;
  }
  lastRefreshTime.value = last
  rates.value = JSON.parse(localStorage.getItem("rates"))
})
</script>
