<template>
  <div v-if="open" :class="[WH.backdrop, 'z-[70]']" @click.self="emit('close')">
    <div :class="WH.panel">
      <div class="flex items-center justify-between">
        <div class="text-xl font-extrabold">{{ whMd(date) }} 週{{ whWeekday(date) }}</div>
        <button type="button" :class="WH.btnSm" aria-label="關閉" @click="emit('close')">✕</button>
      </div>

      <!-- 日別 -->
      <div :class="WH.seg">
        <button
          v-for="t in dayTypes"
          :key="t.value"
          type="button"
          :class="WH.segBtn(form.dayType === t.value)"
          @click="setDayType(t.value)"
        >
          {{ t.label }}
        </button>
      </div>
      <p v-if="form.dayType === 'rdo'" class="-mt-2 text-xs text-slate-400">
        RDO 當天有填時數或地點,會顯示為「RDO 上班」。
      </p>

      <template v-if="form.dayType !== 'off'">
        <!-- 地點:輸入時會用 datalist 顯示相近的歷史地點,下面是最近用過的 3 個 -->
        <div class="space-y-2">
          <label :class="WH.label">地點</label>
          <input
            v-model="form.location"
            list="work-hours-locations"
            autocomplete="off"
            :class="WH.input"
            placeholder="輸入地址"
          />
          <datalist id="work-hours-locations">
            <option v-for="l in locations" :key="l.id" :value="l.name" />
          </datalist>
          <div v-if="recentLocations.length" class="flex flex-wrap gap-2">
            <button
              v-for="l in recentLocations"
              :key="l.id"
              type="button"
              :class="WH.chip(form.location === l.name)"
              @click="form.location = l.name"
            >
              {{ l.name }}
            </button>
          </div>
        </div>

        <!-- 時間 / 時數 -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.customTime" type="checkbox" class="h-5 w-5 accent-[#C8F24D]" @change="onToggleCustom" />
            自訂時間(預設 {{ defaults.start }}~{{ defaults.end }})
          </label>
          <div v-if="form.customTime" class="grid grid-cols-2 gap-3">
            <input v-model="form.startTime" type="time" :class="WH.input" @input="onTimeInput" />
            <input v-model="form.endTime" type="time" :class="WH.input" @input="onTimeInput" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label :class="WH.label">時數(含休息)</label>
            <input v-model.number="form.hours" type="number" inputmode="decimal" min="0" max="24" step="0.5" :class="WH.input" />
          </div>
          <div class="space-y-2">
            <label :class="WH.label">時薪</label>
            <input v-model.number="form.hourlyRate" type="number" inputmode="decimal" min="0" step="0.5" :class="WH.input" />
          </div>
        </div>
        <div class="text-sm">
          時薪總和 <span class="font-extrabold text-[#C8F24D]">{{ whMoney(wagePreview) }}</span>
        </div>
      </template>

      <!-- 額外收入 / 支出 -->
      <div class="space-y-2">
        <label :class="WH.label">額外收入 / 支出</label>
        <div :class="WH.seg">
          <button
            v-for="t in extraTypes"
            :key="t.value"
            type="button"
            :class="WH.segBtn(form.extraType === t.value)"
            @click="setExtraType(t.value)"
          >
            {{ t.label }}
          </button>
        </div>
        <input
          v-if="form.extraType !== 'none'"
          v-model.number="form.extraAmount"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.5"
          :class="WH.input"
          placeholder="金額(填正數)"
        />
      </div>

      <!-- 備註:有額外收入/支出時必填 -->
      <div class="space-y-2">
        <label :class="WH.label">備註{{ form.extraType !== "none" ? "(額外收入/支出請註明內容)" : "" }}</label>
        <input
          v-model="form.note"
          maxlength="500"
          :class="form.extraType !== 'none' && !form.note.trim() ? WH.inputWarn : WH.input"
          :placeholder="form.extraType !== 'none' ? '例如:載同事上下班' : ''"
        />
      </div>

      <div class="flex gap-3 pt-2">
        <button v-if="log" type="button" :class="WH.btnDanger" :disabled="saving" @click="emit('remove')">刪除</button>
        <button type="button" :class="[WH.btnPrimary, 'flex-1']" :disabled="saving" @click="submit">
          {{ saving ? "儲存中…" : "儲存" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  date: { type: String, default: "" },
  log: { type: Object, default: null },
  // 沒有紀錄,但依規則這天預設是 RDO
  defaultRdo: { type: Boolean, default: false },
  settings: { type: Object, default: null },
  // 已依 lastUsedAt DESC 排序
  locations: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
})
const emit = defineEmits(["close", "save", "remove"])

const dayTypes = [
  { value: "work", label: "上班" },
  { value: "off", label: "休息" },
  { value: "rdo", label: "RDO" },
]
const extraTypes = [
  { value: "none", label: "無" },
  { value: "income", label: "收入" },
  { value: "expense", label: "支出" },
]

const defaults = computed(() => ({
  start: props.settings?.defaultStart ?? "07:00",
  end: props.settings?.defaultEnd ?? "17:00",
  hours: props.settings?.defaultHours ?? 10,
  rate: props.settings?.hourlyRate ?? 0,
}))

// 最近使用的 3 個地點
const recentLocations = computed(() => props.locations.slice(0, 3))

const form = reactive({
  dayType: "work",
  location: "",
  customTime: false,
  startTime: "07:00",
  endTime: "17:00",
  hours: 10,
  hourlyRate: 0,
  extraType: "none", // none | income | expense;送出時換成正負數
  extraAmount: 0,
  note: "",
})

const init = () => {
  const l = props.log
  const d = defaults.value
  if (l) {
    Object.assign(form, {
      dayType: l.dayType,
      location: l.locationName ?? "",
      customTime: !!l.startTime,
      startTime: l.startTime ?? d.start,
      endTime: l.endTime ?? d.end,
      hours: l.hours,
      hourlyRate: l.hourlyRate,
      extraType: l.extraAmount > 0 ? "income" : l.extraAmount < 0 ? "expense" : "none",
      extraAmount: Math.abs(l.extraAmount),
      note: l.note ?? "",
    })
    return
  }
  // 新增:預設 07~17、目前時薪;RDO 預設日則預設成 RDO 休息
  Object.assign(form, {
    dayType: props.defaultRdo ? "rdo" : "work",
    location: "",
    customTime: false,
    startTime: d.start,
    endTime: d.end,
    hours: props.defaultRdo ? 0 : d.hours,
    hourlyRate: d.rate,
    extraType: "none",
    extraAmount: 0,
    note: "",
  })
}

watch(
  () => props.open,
  (open) => {
    if (open) init()
  },
  { immediate: true },
)

// 時間含休息,所以時數 = 結束 - 開始(跨午夜自動 +24h)
const calcHours = () => {
  if (!form.startTime || !form.endTime) return form.hours
  const [sh, sm] = form.startTime.split(":").map(Number)
  const [eh, em] = form.endTime.split(":").map(Number)
  let mins = eh * 60 + em - (sh * 60 + sm)
  if (mins <= 0) mins += 24 * 60
  return Math.round((mins / 60) * 100) / 100
}

const onToggleCustom = () => {
  if (form.customTime) form.hours = calcHours()
  else if (form.dayType === "work") form.hours = defaults.value.hours
}

const onTimeInput = () => {
  form.hours = calcHours()
}

const setDayType = (t) => {
  form.dayType = t
  if (t === "off") {
    form.hours = 0
    form.location = ""
    form.customTime = false
  } else if (t === "rdo") {
    form.hours = 0
    form.customTime = false
  } else if (!(form.hours > 0)) {
    form.hours = defaults.value.hours
  }
}

const setExtraType = (t) => {
  form.extraType = t
  if (t === "none") form.extraAmount = 0
}

const wagePreview = computed(() =>
  form.dayType === "off" ? 0 : Math.round(Number(form.hours) * Number(form.hourlyRate) * 100) / 100,
)

const submit = () => {
  const toast = (msg) => useToastStore().showToast(msg, "error")

  const hours = Number(form.hours)
  if (!(hours >= 0 && hours <= 24)) return toast("時數需介於 0 到 24")

  // 收入 = 正數、支出 = 負數
  const amount = Math.abs(Number(form.extraAmount) || 0)
  if (form.extraType !== "none" && amount === 0) return toast("請輸入額外收入/支出的金額")
  const note = form.note.trim()
  if (form.extraType !== "none" && !note) return toast("額外收入/支出需要備註,說明是什麼")
  const extraAmount = form.extraType === "income" ? amount : form.extraType === "expense" ? -amount : 0

  const off = form.dayType === "off"
  const custom = !off && form.customTime
  emit("save", {
    dayType: form.dayType,
    locationName: off ? "" : form.location.trim(),
    hours: off ? 0 : hours,
    startTime: custom ? form.startTime : null,
    endTime: custom ? form.endTime : null,
    hourlyRate: Number(form.hourlyRate) || 0,
    extraAmount,
    note: note || null,
  })
}
</script>
