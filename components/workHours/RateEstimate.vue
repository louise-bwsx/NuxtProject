<template>
  <div ref="root" class="relative">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-baseline gap-2">
        <span class="text-sm text-slate-400">時薪</span>
        <span class="text-2xl font-extrabold">AUD{{ whMoney(settings?.hourlyRate) }}</span>
        <span v-if="rate && settings" class="text-xs text-slate-400">
          ≈ NT${{ fmt(settings.hourlyRate * rate.twdPerAud) }}
        </span>
      </div>
      <button type="button" :class="WH.btnPrimarySm" :aria-expanded="open" @click="toggle">試算</button>
    </div>

    <div v-if="open"
      class="absolute -right-3 -left-3 top-[calc(100%+12px)] z-30 space-y-3 rounded-xl border-2 border-[#3A4352] bg-[#0F1217] p-3 shadow-[4px_4px_0_#000]">
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label :class="WH.label">時薪(AUD)</label>
          <input v-model.number="draft.hourlyRate" type="number" inputmode="decimal" min="0" step="0.5"
            :class="WH.input" />
        </div>
        <div class="space-y-1">
          <label :class="WH.label">房租 / 週(AUD)</label>
          <input v-model.number="draft.rentPerWeek" type="number" inputmode="decimal" min="0" step="1"
            :class="WH.input" />
        </div>
        <div class="space-y-1">
          <label :class="WH.label">每天時數</label>
          <input v-model.number="calc.hoursPerDay" type="number" inputmode="decimal" min="0" max="24" step="0.5"
            :class="WH.input" />
        </div>
        <div class="space-y-1">
          <label :class="WH.label">每週天數</label>
          <input v-model.number="calc.daysPerWeek" type="number" inputmode="numeric" min="0" max="7"
            :class="WH.input" />
        </div>
      </div>

      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-400">
            <th class="py-1 text-left font-normal">項目</th>
            <th class="py-1 text-right font-normal">澳幣 AUD</th>
            <th class="py-1 text-right font-normal">台幣 TWD</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.label" :class="r.strong ? 'font-extrabold text-[#C8F24D]' : ''">
            <td class="py-1">{{ r.label }}</td>
            <td class="py-1 text-right">{{ r.aud < 0 ? "−" : "" }}{{ fmt(Math.abs(r.aud)) }}</td>
            <td class="py-1 text-right">{{ r.twd != null ? `${r.twd < 0 ? "−" : ""}${fmt(Math.abs(r.twd))}` : "—"
            }}</td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between gap-2 text-xs text-slate-400">
        <span v-if="rate">1 AUD ≈ {{ rate.twdPerAud.toFixed(3) }} TWD · {{ updatedLabel }}</span>
        <span v-else>{{ loadingRate ? "取得匯率中…" : "尚無匯率" }}</span>
        <button type="button" :class="WH.btnSm" :disabled="loadingRate" aria-label="更新匯率"
          @click="refreshCurrency">↻</button>
      </div>

      <button v-if="changed" type="button" :class="[WH.btnPrimary, 'w-full']" @click="save">儲存為預設時薪與房租</button>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core"

const props = defineProps({
  settings: { type: Object, default: null },
})
const emit = defineEmits(["saveSettings"])

const STORAGE_KEY = "workHoursAudTwd"
const STALE_MS = 6 * 60 * 60 * 1000

const root = ref(null)
const open = ref(false)
onClickOutside(root, () => {
  open.value = false
})

// 試算用的草稿,可以先試調薪,不會影響已存的設定
const draft = reactive({ hourlyRate: 0, rentPerWeek: 0 })
const calc = reactive({ hoursPerDay: 8, daysPerWeek: 6 })

watch(
  () => props.settings,
  (s) => {
    if (!s) return
    draft.hourlyRate = s.hourlyRate
    draft.rentPerWeek = s.rentPerWeek
  },
  { immediate: true, deep: true },
)

const changed = computed(
  () =>
    props.settings &&
    (Number(draft.hourlyRate) !== props.settings.hourlyRate || Number(draft.rentPerWeek) !== props.settings.rentPerWeek),
)

const save = () => {
  emit("saveSettings", {
    hourlyRate: Number(draft.hourlyRate) || 0,
    rentPerWeek: Number(draft.rentPerWeek) || 0,
  })
}

// ---- 匯率:Coinbase 的 rates 是「1 USD 可換多少」,所以 TWD/AUD = rates.TWD / rates.AUD
const rate = ref(null) // { twdPerAud, updatedAt }
const loadingRate = ref(false)

const refreshCurrency = async () => {
  loadingRate.value = true
  try {
    // 外部 API 直接用 $fetch,不經過 apiStore(否則會把 Authorization 一起送給 Coinbase)
    const resp = await $fetch("https://api.coinbase.com/v2/exchange-rates")
    const allRates = resp.data.rates
    const twdPerAud = Number(allRates.TWD) / Number(allRates.AUD)
    rate.value = { twdPerAud, updatedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rate.value))
  } catch {
    useToastStore().showToast("匯率更新失敗", "error")
  } finally {
    loadingRate.value = false
  }
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.twdPerAud) rate.value = saved
  } catch {
    // 沒有快取就等打開時再抓
  }
})

const toggle = () => {
  open.value = !open.value
  const stale = !rate.value || Date.now() - new Date(rate.value.updatedAt).getTime() > STALE_MS
  if (open.value && stale) refreshCurrency()
}

// ---- 試算(沿用你表格的算法:週薪 × 4 = 月薪、月薪 × 12 = 年薪、房租 × 4)
const rows = computed(() => {
  const weekly = Number(draft.hourlyRate) * Number(calc.hoursPerDay) * Number(calc.daysPerWeek)
  const monthly = weekly * 4
  const yearly = monthly * 12
  const rentMonthly = Number(draft.rentPerWeek) * 4
  const afterRent = monthly - rentMonthly
  return [
    { label: "週薪", aud: weekly },
    { label: "月薪(×4)", aud: monthly },
    { label: "年薪(×12)", aud: yearly },
    { label: "月房租(×4)", aud: -rentMonthly },
    { label: "月薪扣房租", aud: afterRent, strong: true },
  ].map((r) => ({ ...r, twd: rate.value ? r.aud * rate.value.twdPerAud : null }))
})

const fmt = (n) => Math.round(n).toLocaleString("en-AU")
const updatedLabel = computed(() =>
  rate.value ? new Date(rate.value.updatedAt).toLocaleString("sv-SE").slice(5, 16) : "",
)
</script>
