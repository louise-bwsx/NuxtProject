<template>
  <div v-if="open" :class="[WH.backdrop, 'z-[60]']" @click.self="emit('close')">
    <div :class="[WH.panel, 'min-h-[60dvh]']">
      <div class="flex items-center gap-2">
        <input
          ref="inputEl"
          v-model="keyword"
          type="search"
          :class="WH.input"
          placeholder="搜尋地址或備註"
          @input="onInput"
        />
        <button type="button" :class="WH.btnSm" aria-label="關閉" @click="emit('close')">✕</button>
      </div>

      <p v-if="loading" class="py-6 text-center text-sm text-slate-400">搜尋中…</p>
      <p v-else-if="searched && results.length === 0" class="py-6 text-center text-sm text-slate-400">沒有符合的紀錄</p>

      <div v-else class="space-y-3">
        <DayCard
          v-for="l in results"
          :key="l.id"
          :date="l.workDate"
          :log="l"
          @select="emit('select', l.workDate, l)"
        />
        <p v-if="results.length >= 100" class="text-center text-xs text-slate-400">最多顯示 100 筆,請輸入更精確的關鍵字</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import DayCard from "~/components/workHours/DayCard.vue"
import { searchWorkLogs, isApiError } from "~/api/workHours"

const props = defineProps({
  open: { type: Boolean, default: false },
  // 外面每次新增/修改/刪除後 +1,搜尋結果會重新查詢
  version: { type: Number, default: 0 },
})
const emit = defineEmits(["close", "select"])

const keyword = ref("")
const results = ref([])
const searched = ref(false)
const loading = ref(false)
const inputEl = ref(null)
let timer = null

const run = async () => {
  const q = keyword.value.trim()
  if (!q) {
    results.value = []
    searched.value = false
    return
  }
  loading.value = true
  const res = await searchWorkLogs(q)
  loading.value = false
  if (q !== keyword.value.trim()) return // 已經又改了關鍵字,這次結果作廢
  if (isApiError(res)) {
    useToastStore().showToast(res.message, "error")
    return
  }
  results.value = res
  searched.value = true
}

// 停止輸入 300ms 後才查詢
const onInput = () => {
  clearTimeout(timer)
  timer = setTimeout(run, 300)
}

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    await nextTick()
    inputEl.value?.focus()
  },
)

watch(
  () => props.version,
  () => {
    if (props.open) run()
  },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>
