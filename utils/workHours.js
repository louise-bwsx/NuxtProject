// utils/workHours.js (Nuxt 會自動 import utils/ 底下的 export)

// ---------------------------------------------------------------- 日期 / 金額
// 本機時區的今天,格式 YYYY-MM-DD
export const whToday = () => new Date().toLocaleDateString("sv-SE")

export const whAddDays = (ymd, n) => {
  const d = new Date(`${ymd}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// a - b 相差幾天
export const whDiffDays = (a, b) => Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000)

export const whWeekday = (ymd) => ["日", "一", "二", "三", "四", "五", "六"][new Date(`${ymd}T00:00:00Z`).getUTCDay()]

// 2026-07-13 -> 07/13
export const whMd = (ymd) => ymd.slice(5).replace("-", "/")

export const whMoney = (n) => {
  const v = Number(n ?? 0)
  return `${v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString("en-AU", { maximumFractionDigits: 2 })}`
}

// ---------------------------------------------------------------- RDO
// RDO 預設每 14 天一次,從 rdoAnchor 起算;沒有紀錄時也要顯示成「RDO休息」
export const whIsDefaultRdo = (date, rdoAnchor) => {
  if (!rdoAnchor || date < rdoAnchor) return false
  return whDiffDays(date, rdoAnchor) % 14 === 0
}

// RDO 當天有時數或地點,就算「RDO 上班」
export const whDayKind = (log, isDefaultRdo = false) => {
  if (!log) return isDefaultRdo ? "rdo" : "empty"
  if (log.dayType === "rdo") return log.hours > 0 || log.locationName ? "rdoWorked" : "rdo"
  return log.dayType // work | off
}

// 圖表顏色(要跟下面 WH.day 的卡片色系一致)
export const WH_KIND = {
  empty: { label: "未記錄", color: "#64748b" },
  work: { label: "上班", color: "#2dd4bf" },
  off: { label: "休息", color: "#64748b" },
  rdo: { label: "RDO休息", color: "#818cf8" },
  rdoWorked: { label: "RDO上班", color: "#818cf8" },
}

// ---------------------------------------------------------------- Tailwind class
// 配色:頁面 #13161C / 卡片 #1E232C / 輸入框與圖表 #0F1217 / 邊框 #3A4352 / 強調 萊姆綠 #C8F24D
//       上班 深青 #0F4C4A / 休息 灰 #2A303A / RDO 靛紫 #3B3A8F
// class 都寫成完整字串,Tailwind 才掃得到;同一屬性(例如邊框顏色)不要在同一個元素重複出現
const press = "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
const btnBase = `rounded-lg border-2 font-extrabold shadow-[3px_3px_0_#07090C] transition disabled:opacity-50 ${press}`
const dayBase = "w-full rounded-xl border-2 px-3 py-2.5 text-left text-white transition"
const dayShadow = `shadow-[3px_3px_0_#07090C] ${press}`

const dayKind = {
  work: `border-[#3A4352] bg-[#0F4C4A] ${dayShadow}`,
  off: `border-[#3A4352] bg-[#2A303A] ${dayShadow}`,
  rdo: `border-[#3A4352] bg-[#3B3A8F] ${dayShadow}`,
  rdoWorked: `border-[#3A4352] bg-[image:repeating-linear-gradient(135deg,#4F4DC4_0_10px,#3B3A8F_10px_20px)] [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] ${dayShadow}`,
  empty: "border-dashed border-[#3A4352] bg-transparent opacity-70",
}

export const WH = {
  page: "flex h-full w-full flex-col items-center justify-start overflow-y-auto bg-[#13161C] text-white",
  body: "w-full max-w-md space-y-4 p-4 pb-28",

  card: "rounded-xl border-2 border-[#3A4352] bg-[#1E232C] shadow-[3px_3px_0_#07090C]",
  panelBox: "rounded-xl border-2 border-[#3A4352] bg-[#0F1217]",

  btn: `${btnBase} border-[#3A4352] bg-[#0F1217] px-3.5 py-2 text-white`,
  btnSm: `${btnBase} border-[#3A4352] bg-[#0F1217] px-2.5 py-1 text-sm text-white`,
  btnPrimary: `${btnBase} border-[#07090C] bg-[#C8F24D] px-3.5 py-2 text-[#0B0E13]`,
  btnPrimarySm: `${btnBase} border-[#07090C] bg-[#C8F24D] px-2.5 py-1 text-sm text-[#0B0E13]`,
  btnDanger: `${btnBase} border-[#07090C] bg-[#C2410C] px-3.5 py-2 text-white`,

  label: "block text-xs font-bold text-slate-400",
  input:
    "w-full rounded-lg border-2 border-[#3A4352] bg-[#0F1217] px-2.5 py-2 text-white [color-scheme:dark] focus:border-[#C8F24D] focus:outline-none",
  inputWarn:
    "w-full rounded-lg border-2 border-orange-400 bg-[#0F1217] px-2.5 py-2 text-white [color-scheme:dark] focus:outline-none",

  seg: "flex overflow-hidden rounded-lg border-2 border-[#3A4352]",
  segBtn: (active) =>
    `flex-1 border-l-2 border-[#3A4352] py-2 font-extrabold first:border-l-0 ${
      active ? "bg-[#C8F24D] text-[#0B0E13]" : "bg-[#0F1217] text-white"
    }`,
  chip: (active) =>
    `rounded-full border-2 px-2.5 py-0.5 text-xs font-bold ${
      active ? "border-[#07090C] bg-[#C8F24D] text-[#0B0E13]" : "border-[#3A4352] bg-[#0F1217] text-white"
    }`,
  badge: "rounded-full border border-white/30 bg-black/25 px-2 text-[11px] font-bold",

  // 底部彈出的面板(只做進場動畫,用 starting: 不需要 style 區塊)
  backdrop: "fixed inset-0 flex items-end justify-center bg-black/70 transition-opacity duration-200 starting:opacity-0",
  panel:
    "max-h-[92dvh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-2xl border-2 border-b-0 border-[#3A4352] bg-[#13161C] p-4 pb-8 text-white transition-transform duration-200 starting:translate-y-full",

  // 群組(dropdown)
  groupHead: "flex w-full items-center gap-3 px-3 py-2.5 text-left text-white",
  groupBody: "space-y-3 border-t-2 border-[#3A4352] p-3",
  statRow: "flex items-center justify-between text-sm",
  statTotal:
    "flex items-center justify-between rounded-md bg-[#C8F24D] px-2 py-1 text-sm font-extrabold text-[#0B0E13]",

  day: (kind, isToday) =>
    `${dayBase} ${dayKind[kind]} ${isToday ? "outline-2 outline-offset-2 outline-[#C8F24D]" : ""}`,
}
