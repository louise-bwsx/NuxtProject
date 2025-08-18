<template>
  <div class="w-full flex-1 overflow-y-auto" ref="scrollContainer" @scroll="handleScroll">
    <table class="table table-xs">
      <thead>
        <tr>
          <th>序號</th>
          <th>日期</th>
          <th>早餐金額</th>
          <th>早餐類型</th>
          <th>午餐金額</th>
          <th>午餐類型</th>
          <th>晚餐金額</th>
          <th>晚餐類型</th>
          <th>額外花費</th>
          <th>花費類型</th>
          <th class="flex justify-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <CostDataItems />
      </tbody>
    </table>

    <div v-if="isLoading" class="flex justify-center items-center py-4">
      <div class="loading loading-spinner loading-md"></div>
      <span class="ml-2">載入中...</span>
    </div>

    <!-- 沒有更多數據提示 -->
    <div v-if="costStore.hasNoMoreData && !isLoading" class="flex justify-center items-center py-4 text-gray-500">
      沒有更多資料了
    </div>
  </div>
</template>

<script setup>
import CostDataItems from './CostDataItems.vue';

const costStore = useCostStore()

// 瀑布流範例
// 滾動相關的 ref
const scrollContainer = ref(null)
const isLoading = ref(false)

// 節流函數，避免頻繁觸發
const throttle = (func, delay) => {
  let timeoutId
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

// 滾動事件處理函數
const handleScroll = throttle(async (event) => {
  const container = event.target
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight

  // 計算滾動百分比，當滾動到底部前 100px 時開始加載
  const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
  const threshold = 0.9 // 90% 時開始加載

  if (scrollPercentage >= threshold && !isLoading.value && !costStore.hasNoMoreData) {
    await loadMoreData()
  }
}, 200) // 200ms 節流


// 加載更多數據的函數
const loadMoreData = async () => {
  if (isLoading.value || costStore.hasNoMoreData) return

  try {
    isLoading.value = true

    // 記錄加載前的數據數量
    const previousCount = costStore.expenditureList?.length || 0

    // 調用 store 的方法獲取更多數據
    await costStore.searchCosts()

    // 檢查是否有新數據
    const currentCount = costStore.expenditureList?.length || 0

    // 如果數據數量沒有增加，說明沒有更多數據了
    if (currentCount <= previousCount) {
      costStore.hasNoMoreData = true
    }

  } catch (error) {
    console.error('載入數據失敗:', error)
    // 可以在這裡添加錯誤提示
  } finally {
    isLoading.value = false
  }
}

// 組件卸載時清理
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})

// 目前搜尋交給 SearchInput 這裡先註解
// onMounted(async () => {
//   expenditureList.value = await costStore.getCosts()
// });
</script>