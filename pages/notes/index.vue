<template>
  <div class="h-screen w-full overflow-hidden">
    <!-- 超讚的elmentplus 瀑布流 -->
    <div v-infinite-scroll="load" class="overflow-y-scroll w-full h-full p-0 m-0" style="overflow: auto">

      <SearchInput v-model:showSearchInput="showSearchInput" @onReset="onReset" @onSearch="onSearch"/>

      <NuxtLink v-for="note in notesStore.notes" :key="note" :to="`/notes/${encodeURIComponent(note.title)}`"
        class="flex justify-between items-center gap-[8px] flex-1 h-[50px] m-[10px] p-[8px] bg-black overflow-x-hidden">
        <!-- 20250825 louise 為了避免 title中因為其他字符 # 導致在搜尋時被截斷 使用encodeURIComponent -->
        <div class="bbb whitespace-nowrap text-ellipsis flex-1 overflow-hidden">
          {{ note.title }}
        </div>
        <!-- 20250814 故意寫死90px 避免因為數字盡量小 大小不一 -->
        <div class="ooo whitespace-nowrap text-end w-[100px]">{{ note.createDate.split('T')[0] }}</div>
      </NuxtLink>
    </div>

    <button @click="haneldClickSearchButton"
      class="fixed bottom-5 left-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="@/assets/icons/search_40_40_white.svg" class="w-[24px] h-[24px]">
    </button>

    <NuxtLink to="/notes/create?isEdit=true"
      class="fixed bottom-5 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="~/assets/icons/edit_24_24_white.svg" class="w-[24px] h-[24px]">
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotesStore } from '#imports'
import { useRoute } from 'vue-router'
import SearchInput from '~/components/expenditure/SearchInput.vue'

const notesStore = useNotesStore()
const route = useRoute()

const showSearchInput = ref(false)

const haneldClickSearchButton = () => {
  showSearchInput.value = !showSearchInput.value
}

const onReset = () => {
  notesStore.page = 1
  notesStore.resetLoadingState()
  notesStore.searchNotes()
}

const onSearch = () => {
  notesStore.page = 1
  notesStore.resetLoadingState()
  notesStore.searchNotes()
}

const load = async () => {
  await notesStore.searchNotes()
}

onMounted(() => {
  // 不能直接用 route.query != {} 即使logroute.query顯示{} 還是會回傳true
  showSearchInput.value = Object.keys(route.query).length > 0
})
</script>