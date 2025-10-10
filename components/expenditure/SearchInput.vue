<template>
  <div v-show="props.showSearchInput" class="flex flex-col  p-[8px] gap-[8px] w-screen">
    <el-input ref="keywordInputRef" class="flex-1" type="text" v-model="keyword" placeholder="搜尋" clearable size="large"
      @keydown.enter="onSearch" @keydown.esc="onReset" />

    <el-date-picker class="flex-1 min-w-full" v-model="dateRange" type="daterange" unlink-panels range-separator="到"
      start-placeholder="起始日" end-placeholder="結束日" :shortcuts="shortcuts" size="large" format="YYYY/MM/DD"
      value-format="YYYY-MM-DD" />

    <div class=" flex w-full gap-[8px]">
      <button @click="onReset" class="btn flex-1">重設</button>
      <button @click="onSearch" class="btn flex-1">搜尋</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const props = defineProps({
  showSearchInput: Boolean
});
const emit = defineEmits(['onReset', 'onSearch'])

const keywordInputRef = ref(null)
const keyword = ref("")
const dateRange = ref([])
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
  keyword.value = ""
  dateRange.value = []

  await router.push({ query: {} })

  emit('onReset')
}

const onSearch = async () => {
  console.log(`keyword: ${keyword.value}`)
  // 使用 router.push 更新 query 參數
  // 或是改用router.replace 就不會留下紀錄 上一頁就不會顯示上一個搜尋條件
  await router.push({
    query: {
      ...route.query, // 保留現有的 query 參數
      keyword: keyword.value,
      startDate: dateRange.value[0],
      endDate: dateRange.value[1]
    }
  })

  emit('onSearch')
}

onMounted(() => {
  keyword.value = route.query.keyword
  dateRange.value[0] = route.query.startDate
  dateRange.value[1] = route.query.endDate
})

watch(
  () => props.showSearchInput,
  async (newVal) => {
    if (!newVal)
      return

    keyword.value = route.query.keyword
    dateRange.value[0] = route.query.startDate
    dateRange.value[1] = route.query.endDate

    // 開啟時自動focus
    await nextTick()
    keywordInputRef.value?.focus()
  },
  { immediate: true }
)
</script>
