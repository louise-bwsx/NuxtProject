<template>
  <section :class="WH.card">
    <!-- 標題:期間 / 平均時薪 / 總時數 / 總金額 -->
    <button type="button" :class="WH.groupHead" :aria-expanded="expanded" @click="emit('toggle')">
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <div class="flex items-center gap-2">
          <span class="text-base font-extrabold">{{ whMd(period.periodStart) }} – {{ whMd(period.periodEnd) }}</span>
          <span v-if="badge" :class="WH.badge">{{ badge }}</span>
        </div>
        <div class="text-xs text-slate-300">
          <template v-if="period.totalHours > 0">
            平均時薪 {{ whMoney(period.avgHourlyRate) }} · {{ period.totalHours }}h
          </template>
          <template v-else>尚無工時</template>
        </div>
      </div>
      <div class="text-lg font-black text-[#C8F24D]">{{ whMoney(period.grandTotal) }}</div>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-5 w-5 shrink-0 text-slate-400 transition-transform"
        :class="expanded ? 'rotate-180' : ''"
      >
        <path d="M5 7.5 10 12.5 15 7.5" />
      </svg>
    </button>

    <div v-if="expanded" :class="WH.groupBody">
      <p v-if="loading && !logs" class="py-6 text-center text-sm text-slate-400">載入中…</p>

      <template v-else>
        <DayCard
          v-for="d in days"
          :key="d.date"
          :date="d.date"
          :log="d.log"
          :is-today="d.date === today"
          :is-default-rdo="d.rdo"
          @select="(date) => emit('select', date, d.log)"
        />

        <HoursChart :days="days" />

        <!-- 領薪方式(每兩週記錄一次) -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-sm">
            <span class="font-bold">領薪方式</span>
            <span v-if="!period.method" class="text-xs text-slate-400">尚未記錄</span>
          </div>
          <div :class="WH.seg">
            <button type="button" :class="WH.segBtn(period.method === 'bank')" @click="emit('setMethod', 'bank')">銀行匯款</button>
            <button type="button" :class="WH.segBtn(period.method === 'cash')" @click="emit('setMethod', 'cash')">現金</button>
          </div>
        </div>

        <!-- 這一期的統計:每個項目一列 -->
        <div :class="[WH.panelBox, 'space-y-1.5 p-3']">
          <div :class="WH.statRow">
            <span class="text-slate-300">總時數</span>
            <span class="font-bold">{{ period.totalHours }}h · {{ period.workedDays }} 天</span>
          </div>
          <div :class="WH.statRow">
            <span class="text-slate-300">時薪總和</span>
            <span class="font-bold">{{ whMoney(period.wageTotal) }}</span>
          </div>
          <div v-if="period.extraIncome > 0" :class="WH.statRow">
            <span class="text-slate-300">額外收入</span>
            <span class="font-bold text-emerald-300">+{{ whMoney(period.extraIncome) }}</span>
          </div>
          <div v-if="period.extraExpense > 0" :class="WH.statRow">
            <span class="text-slate-300">額外支出</span>
            <span class="font-bold text-orange-300">−{{ whMoney(period.extraExpense) }}</span>
          </div>
          <div :class="WH.statTotal">
            <span>總金額</span>
            <span>{{ whMoney(period.grandTotal) }}</span>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import DayCard from "~/components/workHours/DayCard.vue"
import HoursChart from "~/components/workHours/HoursChart.vue"

const props = defineProps({
  // GET /workPeriods 的一筆:期間 + 領薪方式 + 統計
  period: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
  // 這一期的每日紀錄,尚未載入為 null
  logs: { type: Array, default: null },
  loading: { type: Boolean, default: false },
  today: { type: String, required: true },
  rdoAnchor: { type: String, default: "" },
})
const emit = defineEmits(["toggle", "select", "setMethod"])

// 這一期的 14 天(沒紀錄的日子 log 為 null;rdo = 依規則預設是 RDO)
const days = computed(() => {
  const map = new Map((props.logs ?? []).map((l) => [l.workDate, l]))
  return Array.from({ length: 14 }, (_, i) => {
    const date = whAddDays(props.period.periodStart, i)
    return { date, log: map.get(date) ?? null, rdo: whIsDefaultRdo(date, props.rdoAnchor) }
  })
})

const badge = computed(() => {
  const { periodStart, periodEnd } = props.period
  if (props.today >= periodStart && props.today <= periodEnd) return "本期"
  if (props.today < periodStart) return "下一期"
  return ""
})
</script>
