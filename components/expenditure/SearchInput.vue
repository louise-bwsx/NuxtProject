<template>
  <div v-show="props.showSearchInput" class="flex flex-col p-[8px] gap-[8px] w-full">
    <el-input ref="keywordInputRef" class="flex-1" type="text" v-model="keyword" placeholder="搜尋" clearable size="large"
      @keydown.enter="onSearch" @keydown.esc="onReset" />

    <el-date-picker class="flex-1 min-w-full" v-model="dateRange" type="daterange" unlink-panels range-separator="到"
      start-placeholder="起始日" end-placeholder="結束日" :shortcuts="shortcuts" size="large" format="YYYY/MM/DD"
      value-format="YYYY-MM-DD" />

    <!-- 20251110 只有在筆記列表的搜尋才要顯示SortButton -->
    <div v-if="route.path == '/notes'" class="flex gap-2 overflow-hidden">
      <SortButton title="新增日期" value="createDate" :sortType="sortType" :sortOption="sortOption"
        @onClick="onSort('createDate')" />
      <SortButton title="觀看次數" value="viewCount" :sortType="sortType" :sortOption="sortOption"
        @onClick="onSort('viewCount')" />
      <SortButton title="讚數" value="likeCount" :sortType="sortType" :sortOption="sortOption"
        @onClick="onSort('likeCount')" />
      <SortButton title="倒讚數" value="likeCount" :sortType="sortType" :sortOption="sortOption"
        @onClick="onSort('dislikeCount')" />
    </div>

    <div class=" flex w-full gap-[8px]">
      <button @click="onReset" class="btn flex-1">重設</button>
      <button @click="onSearch" class="btn flex-1">搜尋</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import SortButton from '../common/SortButton.vue';

const route = useRoute()
const router = useRouter()

const props = defineProps({
  showSearchInput: Boolean
});
const emit = defineEmits(['onReset', 'onSearch'])

const keywordInputRef = ref(null)
const keyword = ref("")
const sortType = ref("")
const sortOption = ref("")
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

const onSort = (type) => {
  if (sortType.value == type && sortOption.value == '') {
    sortOption.value = 'DESC'
  } else if (sortType.value == type && sortOption.value == 'DESC') {
    sortOption.value = 'ASC'
  } else if (sortType.value == type && sortOption.value == 'ASC') {
    sortOption.value = ''
  } else {
    sortType.value = type
    sortOption.value = 'DESC'
  }
  onSearch()
}

const onSearch = async (event) => {
  // 如果是 Shift + Enter，不做任何處理，讓它自然換行
  if (event.shiftKey) return

  // 攔截 Enter 的預設換行行為（避免送出後輸入框殘留換行）
  event.preventDefault()

  if (event.isComposing) return

  const content = keyword.value.trim()

  if (!content) return

  // 使用 router.push 更新 query 參數
  // 或是改用router.replace 就不會留下紀錄 上一頁就不會顯示上一個搜尋條件
  await router.push({
    query: {
      // 為了在ASC的狀態後清空排序 取消...route.query
      ...(keyword.value && { keyword: keyword.value }), // 只有不是空字串的情況下在會增加
      ...(dateRange.value[0] && { startDate: dateRange.value[0] }),
      ...(dateRange.value[1] && { endDate: dateRange.value[1] }),
      ...(sortType.value && sortOption.value && { sortType: sortType.value }),
      ...(sortOption.value && { sortOption: sortOption.value })
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
