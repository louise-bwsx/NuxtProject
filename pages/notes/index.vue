<template>
  <div class="w-full h-full border-s border-e border-black">
    <div class="overflow-y-scroll w-full h-full p-0 m-0 overflow-auto" ref="scrollContainer" @scroll="onScroll">
      <!-- 20251009 從v-model:showSearchInput改成:showSearchInput 避免出現Error提示 -->
      <SearchInput :showSearchInput="showSearchInput" @onReset="notesStore.resetLoadingState"
        @onSearch="notesStore.resetLoadingState()" />

      <Item v-for="note in notesStore.notes" :key="note" :note="note" />
    </div>

    <button @click="onClickSearchButton"
      class="fixed bottom-20 left-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="@/assets/icons/search_40_40_white.svg" class="w-[24px] h-[24px]">
    </button>

    <NuxtLink to="/notes/read?mode=edit"
      class="fixed bottom-20 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="~/assets/icons/edit_24_24_white.svg" class="w-[24px] h-[24px]">
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SearchInput from '~/components/expenditure/SearchInput.vue'
import Item from '~/components/notes/item.vue'

const notesStore = useNotesStore()
const keybindStore = useKeybindStore()

const route = useRoute()
const showSearchInput = ref(false)

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

  if (scrollPercentage >= threshold && !isLoading.value && !notesStore.hasNoMoreData) {
    await loadMoreData()
  }
}
// 加載更多數據的函數
const loadMoreData = async () => {
  if (isLoading.value || notesStore.hasNoMoreData) return

  try {
    isLoading.value = true

    // 記錄加載前的數據數量
    const previousCount = notesStore.notes?.length || 0

    // 調用 store 的方法獲取更多數據
    await notesStore.searchNotes()

    // 檢查是否有新數據
    const currentCount = notesStore.notes?.length || 0

    // 如果數據數量沒有增加，說明沒有更多數據了
    if (currentCount <= previousCount) {
      notesStore.hasNoMoreData = true
    }

  } catch (error) {
    console.error('載入數據失敗:', error)
    // 可以在這裡添加錯誤提示
  } finally {
    isLoading.value = false
  }
}

const onClickSearchButton = () => {
  showSearchInput.value = !showSearchInput.value
}

onMounted(async () => {
  // 20251009 為了即時更新筆記列表
  notesStore.resetLoadingState()

  // 不能直接用 route.query != {} 即使logroute.query顯示{} 還是會回傳true
  showSearchInput.value = Object.keys(route.query).length > 0
  keybindStore.setListener("notes", onClickSearchButton)
})

// 20251013 避免在切換頁面後 仍然保持true的狀態 導致無法進入下一頁
onUnmounted(() => {
  notesStore.hasNoMoreData = false
})
</script>
