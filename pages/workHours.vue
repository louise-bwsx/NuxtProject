<template>
  <div :class="WH.page">
    <button @click="onClickSearchButton"
      class="fixed bottom-20 left-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="@/assets/icons/search_40_40_white.svg" class="w-[24px] h-[24px]" />
    </button>

    <div :class="WH.body">
      <!-- 時薪 + 試算 -->
      <div v-if="settings" :class="[WH.card, 'p-3']">
        <RateEstimate :settings="settings" @save-settings="onSaveSettings" />
      </div>

      <!-- 每兩週一個群組,新的在前,預設收合 -->
      <p v-if="loadingPeriods" class="py-10 text-center text-sm text-slate-400">載入中…</p>
      <div v-else class="space-y-3">
        <PeriodGroup v-for="p in periods" :key="p.periodStart" :period="p" :expanded="!!expanded[p.periodStart]"
          :logs="logsMap[p.periodStart] ?? null" :loading="!!loadingMap[p.periodStart]" :today="today"
          :rdo-anchor="settings?.rdoAnchor ?? ''" @toggle="toggleGroup(p)" @select="openEditor"
          @set-method="(method) => setMethod(p, method)" />
      </div>
    </div>

    <DayEditor :open="editor.open" :date="editor.date" :log="editor.log"
      :default-rdo="!editor.log && whIsDefaultRdo(editor.date, settings?.rdoAnchor)" :settings="settings"
      :locations="locations" :saving="saving" @close="editor.open = false" @save="onSave" @remove="onRemove" />

    <SearchSheet :open="searchOpen" :version="searchVersion" @close="searchOpen = false" @select="openEditor" />
  </div>
</template>

<script setup>
import RateEstimate from "~/components/workHours/RateEstimate.vue"
import PeriodGroup from "~/components/workHours/PeriodGroup.vue"
import DayEditor from "~/components/workHours/DayEditor.vue"
import SearchSheet from "~/components/workHours/SearchSheet.vue"
import {
  getWorkLogs,
  putWorkLog,
  deleteWorkLog,
  getWorkLocations,
  getWorkPeriods,
  putWorkPeriod,
  getWorkSettings,
  putWorkSettings,
  isApiError,
} from "~/api/workHours"

const toast = (msg, type = "success") => useToastStore().showToast(msg, type)

const today = whToday()
const isSunday = new Date().getDay() === 0

const settings = ref(null)
const locations = ref([]) // 依 lastUsedAt DESC
const periods = ref([]) // 依期間 DESC,每筆含統計
const expanded = ref({}) // periodStart -> 是否展開
const logsMap = ref({}) // periodStart -> 該期每日紀錄
const loadingMap = ref({})
const loadingPeriods = ref(true)
const saving = ref(false)
const editor = reactive({ open: false, date: "", log: null })
const searchOpen = ref(false)
const searchVersion = ref(0)

const loadSettings = async () => {
  const res = await getWorkSettings()
  if (isApiError(res)) return toast(res.message, "error")
  settings.value = res
}

const loadLocations = async () => {
  const res = await getWorkLocations()
  if (isApiError(res)) return toast(res.message, "error")
  locations.value = res
}

// 星期日:多列出下一個兩週(傳「今天 + 14 天」,後端就會從包含那天的那一期往回列)
const loadPeriods = async () => {
  const res = await getWorkPeriods(isSunday ? whAddDays(today, 14) : today)
  if (isApiError(res)) return toast(res.message, "error")
  periods.value = res
}

const loadLogsFor = async (p) => {
  const key = p.periodStart
  loadingMap.value[key] = true
  console.log(p.periodStart)
  const res = await getWorkLogs(p.periodStart, p.periodEnd)
  loadingMap.value[key] = false
  if (isApiError(res)) return toast(res.message, "error")
  logsMap.value[key] = res
}

const toggleGroup = async (p) => {
  const key = p.periodStart
  expanded.value[key] = !expanded.value[key]
  if (expanded.value[key] && !logsMap.value[key]) await loadLogsFor(p)
}

const setMethod = async (p, method) => {
  const next = p.method === method ? null : method // 再點一次 = 清除
  const res = await putWorkPeriod(p.periodStart, next)
  if (isApiError(res)) return toast(res.message, "error")
  p.method = res.method
}

const openEditor = (date, log = null) => {
  if (!settings.value) return toast("設定尚未載入", "error")
  editor.date = date
  editor.log = log
  editor.open = true
}

// 新增/修改/刪除之後:更新各期統計、地點排序,並重新載入該日所在的那一期
const afterChange = async (date) => {
  await Promise.all([loadPeriods(), loadLocations()])
  const p = periods.value.find((x) => date >= x.periodStart && date <= x.periodEnd)
  if (p) {
    if (expanded.value[p.periodStart]) await loadLogsFor(p)
    else delete logsMap.value[p.periodStart] // 沒展開的下次展開時再載入
  }
  searchVersion.value++
}

const onSave = async (payload) => {
  saving.value = true
  const res = await putWorkLog(editor.date, payload)
  saving.value = false
  if (isApiError(res)) return toast(res.message, "error")
  editor.open = false
  toast("已儲存")
  await afterChange(res.workDate)
}

const onRemove = async () => {
  if (!confirm("確定刪除這天的紀錄?")) return
  const date = editor.date
  saving.value = true
  const res = await deleteWorkLog(date)
  saving.value = false
  if (isApiError(res)) return toast(res.message, "error")
  editor.open = false
  toast("已刪除")
  await afterChange(date)
}

const onSaveSettings = async (patch) => {
  const res = await putWorkSettings({ ...settings.value, ...patch })
  if (isApiError(res)) return toast(res.message, "error")
  settings.value = res
  toast("設定已更新")
}

const onClickSearchButton = () => {
  searchOpen.value = true
}

onMounted(async () => {
  await Promise.all([loadSettings(), loadLocations(), loadPeriods()])
  loadingPeriods.value = false
})
</script>
