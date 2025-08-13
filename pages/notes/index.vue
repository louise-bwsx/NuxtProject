<template>
  <div class="aaa h-screen w-full overflow-hidden">
    <!-- 超讚的elmentplus 瀑布流 -->
    <div v-infinite-scroll="load" class="infinite-list overflow-y-scroll aaa w-full h-full p-0 m-0" style="overflow: auto">
      <!-- 目前只有這個有瀑布流 不知道為什麼底下div沒有 -->
      <!-- <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li> -->

      <div v-for="note in notesStore.notes" :key="note"
        class="flex justify-between items-center gap-[8px] flex-1 h-[50px] m-[10px] aaa p-[8px] bg-black overflow-x-hidden">
        <NuxtLink :to="`/notes/${note.title}`" class="bbb whitespace-nowrap text-ellipsis flex-1 overflow-hidden">{{ note.title }}</NuxtLink>
        <div class="ooo whitespace-nowrap text-end">{{ note.createDate.split('T')[0] }}</div>
        <!-- <div class="">{{ note.updateDate }}</div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const notesStore = useNotesStore()

onMounted(() => {
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