<template>
  <div class="h-screen w-full overflow-hidden">
    <!-- 超讚的elmentplus 瀑布流 -->
    <div v-infinite-scroll="load" class="infinite-list overflow-y-scroll w-full h-full p-0 m-0" style="overflow: auto">
      <!-- 目前只有這個有瀑布流 不知道為什麼底下div沒有 -->
      <!-- <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li> -->

      <NuxtLink v-for="note in notesStore.notes" :key="note" :to="`/notes/${encodeURIComponent(note.title)}`"
        class="flex justify-between items-center gap-[8px] flex-1 h-[50px] m-[10px] p-[8px] bg-black overflow-x-hidden">
        <!-- 20250825 louise 為了避免 title中因為其他字符 # 導致在搜尋時被截斷 使用encodeURIComponent -->
        <div class="bbb whitespace-nowrap text-ellipsis flex-1 overflow-hidden">
          {{ note.title }}
        </div>
        <!-- 20250814 故意寫死90px 避免因為數字盡量小 大小不一 -->
        <div class="ooo whitespace-nowrap text-end w-[100px]">{{ note.createDate.split('T')[0] }}</div>
        <!-- <div class="">{{ note.updateDate }}</div> -->
      </NuxtLink>
    </div>

    <NuxtLink to="/notes/create?isEdit=true"
      class="fixed bottom-5 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="~/assets/icons/edit_24_24_white.svg" class="w-[24px] h-[24px]">
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const notesStore = useNotesStore()

onMounted(() => {
  // 避免從詳細頁返回時 再call一次出現重複資料
  notesStore.page = 1
  notesStore.searchNotes()
})

const count = ref(0)
const load = () => {
  count.value += 2
  console.log(`load`)
}
</script>

<!-- TODO: 暫時不要刪掉等到這個版本的 瀑布流成功再刪 -->
<style>
.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}

.infinite-list .infinite-list-item+.list-item {
  margin-top: 10px;
}
</style>