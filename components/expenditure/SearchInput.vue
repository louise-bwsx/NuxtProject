<template>
  <div v-show="props.showSearchInput" class="flex flex-col bbb p-[8px] gap-[8px] w-screen">
    <el-input class="flex-1" type="text" v-model="detail" placeholder="明細" clearable size="large" />

    <el-date-picker class="flex-1 min-w-full" v-model="dateRange" type="daterange" unlink-panels range-separator="到"
      start-placeholder="起始日" end-placeholder="結束日" :shortcuts="shortcuts" size="large" format="YYYY/MM/DD"
      value-format="YYYY-MM-DD" />

    <div class="bbb flex w-full gap-[8px]">
      <button @click="onReset" class="btn flex-1">重設</button>
      <button @click="onSearch" class="btn flex-1">搜尋</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCostStore } from '#imports';

const route = useRoute()
const router = useRouter()
const costStore = useCostStore()

const props = defineProps({
  showSearchInput: Boolean
});

// 為了讓watch immediate 需要使用true
const needToSearch = ref(true)
const detail = ref("")
const dateRange = ref("")
const shortcuts = [
  {
    text: '一個禮拜前',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '一個月前',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '三個月前',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const onReset = async () => {
  detail.value = ""
  dateRange.value = ""
  // 固定給1 在searchCost callAPI後會++ page 1 才會重置資料
  costStore.page = 1
  // 重置hasNoMoreData 避免捲動時取得錯誤狀態
  costStore.resetLoadingState()

  await router.push({
    query: {
      ...route.query, // 保留現有的 query 參數
      detail: detail.value,
      startDate: dateRange.value[0],
      endDate: dateRange.value[1]
    }
  })

  needToSearch.value = true
}

const onSearch = async () => {
  // 固定給1 在searchCost callAPI後會++ page 1 才會重置資料
  costStore.page = 1
  // 重置hasNoMoreData 避免捲動時取得錯誤狀態
  costStore.resetLoadingState()

  // 使用 router.push 更新 query 參數
  // 或是改用router.replace 就不會留下紀錄 上一頁就不會顯示上一個搜尋條件
  await router.push({
    query: {
      ...route.query, // 保留現有的 query 參數
      detail: detail.value,
      startDate: dateRange.value[0],
      endDate: dateRange.value[1]
    }
  })

  needToSearch.value = true
}

watch(
  () => needToSearch.value,
  (newVal) => {
    if (!newVal) {
      return;
    }

    //  避免重新整理出現ssr 跑進來
    if (!import.meta.client) {
      return;
    }

    costStore.searchCosts()

    needToSearch.value = false
  },
  { immediate: true }
)
</script>