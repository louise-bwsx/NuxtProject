<template>
  <div class="w-full flex-1 overflow-y-auto" ref="scrollContainer" @scroll="onScroll">
    <table class="table table-xs">
      <thead>
        <tr>
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
        <!-- 20250511 在csv只有4個row的情況下只會顯示4天 暫時增加csv row數量 -->
        <tr class="hover:bg-base-300 transition-colors duration-200" v-for="(data, index) in costStore.expenditureList"
          :key="data">
          <td class="!py-[0px]"><input class="w-[90px] h-[30px]" type="date" v-model="data.costDate.split('T')[0]" />
          </td>
          <td class="!py-[0px]"><input class="w-[50px] h-[30px]" type="number" v-model="data.breakfastCost" /></td>
          <td class="!py-[0px]"><input class="flex-1 h-[30px]" type="text" @mousedown="startPress"
              @mouseup="cancelPress" @mouseleave="cancelPress" @touchstart="startPress" @touchend="cancelPress"
              @touchmove="cancelPress" v-model="data.breakfastType" /></td>
          <td class="!py-[0px]"><input class="w-[50px] h-[30px]" type="number" v-model="data.lunchCost" /></td>
          <td class="!py-[0px]"><input class="flex-1 h-[30px]" type="text" @mousedown="startPress"
              @mouseup="cancelPress" @mouseleave="cancelPress" @touchstart="startPress" @touchend="cancelPress"
              @touchmove="cancelPress" v-model="data.lunchType" /></td>
          <td class="!py-[0px]"><input class="w-[50px] h-[30px]" type="number" v-model="data.dinnerCost" /></td>
          <td class="!py-[0px]"><input class="flex-1 h-[30px]" type="text" @mousedown="startPress"
              @mouseup="cancelPress" @mouseleave="cancelPress" @touchstart="startPress" @touchend="cancelPress"
              @touchmove="cancelPress" v-model="data.dinnerType" /></td>
          <td class="!py-[0px]"><input class="w-[50px] h-[30px]" type="number" v-model="data.extraCost" /></td>
          <td class="!py-[0px]"><input class="flex-1 h-[30px]" type="text" @mousedown="startPress"
              @mouseup="cancelPress" @mouseleave="cancelPress" @touchstart="startPress" @touchend="cancelPress"
              @touchmove="cancelPress" v-model="data.extraType" /></td>
          <td class="!py-[0px] text-nowrap flex justify-center"><button @click="onSaveDay(index)"
              class="btn">儲存</button></td>
        </tr>
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
const costStore = useCostStore()

// 瀑布流範例
// 滾動相關的 ref
const scrollContainer = ref(null)
const isLoading = ref(false)

// 滾動事件處理函數
const onScroll = async (event) => {
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
}

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

const onSaveDay = async (index) => {
  await costStore.onSaveDay({
    costDate: costStore.expenditureList[index].costDate,
    breakfastCost: costStore.expenditureList[index].breakfastCost.toString(),
    breakfastType: costStore.expenditureList[index].breakfastType,
    lunchCost: costStore.expenditureList[index].lunchCost.toString(),
    lunchType: costStore.expenditureList[index].lunchType,
    dinnerCost: costStore.expenditureList[index].dinnerCost.toString(),
    dinnerType: costStore.expenditureList[index].dinnerType,
    extraCost: costStore.expenditureList[index].extraCost.toString(),
    extraType: costStore.expenditureList[index].extraType,
  })
};

let pressTimer = null

const startPress = (event) => {
  pressTimer = setTimeout(async () => {
    const value = event.target.value
    if (!value) return
    await navigator.clipboard.writeText(value)
    useToastStore().showToast("已複製", "success")
  }, 500)
}

const cancelPress = () => {
  clearTimeout(pressTimer)
}
</script>
