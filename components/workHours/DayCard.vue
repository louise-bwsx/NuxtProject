<template>
  <button type="button" :class="WH.day(kind, isToday)" @click="emit('select', date)">
    <div class="flex items-center gap-3">
      <div class="min-w-0 flex-1 space-y-0.5">
        <div class="flex items-center gap-2 text-xs">
          <span class="font-bold">{{ whMd(date) }} 週{{ whWeekday(date) }}</span>
          <span :class="WH.badge">{{ meta.label }}</span>
        </div>
        <div v-if="log?.locationName" class="truncate text-sm font-semibold">{{ log.locationName }}</div>
        <div v-else-if="kind === 'empty'" class="text-sm text-slate-400">點擊新增</div>
        <div v-if="log?.startTime" class="text-xs text-slate-300">{{ log.startTime }}~{{ log.endTime }}</div>
        <div v-if="log?.note" class="truncate text-xs text-slate-300">{{ log.note }}</div>
      </div>

      <div v-if="showRight" class="shrink-0 text-right leading-tight">
        <div class="text-lg font-extrabold">{{ log.hours }}h</div>
        <div class="text-xs text-slate-200">{{ whMoney(log.wageTotal) }}</div>
        <div
          v-if="log.extraAmount !== 0"
          class="text-xs font-bold"
          :class="log.extraAmount > 0 ? 'text-emerald-300' : 'text-orange-300'"
        >
          {{ log.extraAmount > 0 ? "+" : "−" }}{{ whMoney(Math.abs(log.extraAmount)) }}
        </div>
      </div>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  date: { type: String, required: true },
  log: { type: Object, default: null },
  isToday: { type: Boolean, default: false },
  // 沒有紀錄,但依 RDO 規則這天預設是 RDO
  isDefaultRdo: { type: Boolean, default: false },
})
const emit = defineEmits(["select"])

const kind = computed(() => whDayKind(props.log, props.isDefaultRdo))
const meta = computed(() => WH_KIND[kind.value])
const showRight = computed(() => props.log && (props.log.hours > 0 || props.log.extraAmount !== 0))
</script>
