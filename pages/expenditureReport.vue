<template>
  <!-- 20251009 加上h-full 避免Dock因為內容太少跑版 -->
  <div class="w-full h-full flex flex-col justify-start items-center overflow-y-auto">
    <!-- 20251009 從v-model:showSearchInput改成:showSearchInput 避免出現Error提示 -->
    <SearchInput :showSearchInput="showSearchInput" @onReset="onReset" @onSearch="onSearch" />

    <ResponseDataTable />

    <button @click="onClickSearchButton"
      class="fixed bottom-20 left-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="@/assets/icons/search_40_40_white.svg" class="w-[24px] h-[24px]">
    </button>

    <button @click="onClickAddButton"
      class="fixed bottom-20 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="@/assets/icons/add_40_40_white.svg" class="w-[24px] h-[24px]">
    </button>
  </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast';
import { useRoute } from 'vue-router';
import ResponseDataTable from "~/components/expenditure/ResponseDataTable.vue";
import SearchInput from '~/components/expenditure/SearchInput.vue';

usePageSeo({
  title: '開銷紀錄',
  description: '開銷紀錄',
  url: 'https://www.louise.tw/expenditureReport'
})

const toastStore = useToastStore()
const costStore = useCostStore()
const authStore = useAuthStore()
const keybindStore = useKeybindStore()

const route = useRoute()

const showSearchInput = ref(false)
const userName = ref("")

const onClickSearchButton = () => {
  showSearchInput.value = !showSearchInput.value
}

const onClickAddButton = () => {
  const accessToken = authStore.getAccessToken
  if (authStore.isExpire(accessToken)) {
    toastStore.showToast('請重新登入', "error")
    return
  }
  costStore.showMenu = true
}

const onReset = () => {
  // 固定給1 在searchCost callAPI後會++ page 1 才會重置資料
  costStore.page = 1
  // 重置hasNoMoreData 避免捲動時取得錯誤狀態
  costStore.resetLoadingState()
  costStore.searchCosts()
}

const onSearch = () => {
  // 固定給1 在searchCost callAPI後會++ page 1 才會重置資料
  costStore.page = 1
  // 重置hasNoMoreData 避免捲動時取得錯誤狀態
  costStore.resetLoadingState()
  costStore.searchCosts()
}

onMounted(async () => {
  // 不要直接在Template使用 useUserInfoStore().getUserInfo.name 會有Hydration Warning
  userName.value = authStore.getUserInfo.name;

  // 不能直接用 route.query != {} 即使logroute.query顯示{} 還是會回傳true
  showSearchInput.value = Object.keys(route.query).length > 0
  keybindStore.setListener("expenditureReport", onClickSearchButton)

  await costStore.searchCosts()
});
</script>
