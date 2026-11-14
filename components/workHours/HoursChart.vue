<template>
  <div :class="[WH.panelBox, 'p-2']">
    <div class="px-1 pb-1 text-xs font-bold text-slate-400">每日時數</div>
    <div ref="el" class="h-[170px]"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import { useResizeObserver } from "@vueuse/core"

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  // [{ date, log, rdo }]
  days: { type: Array, default: () => [] },
})

const el = ref(null)
let chart = null

const kindOf = (d) => whDayKind(d.log, d.rdo)

const buildOption = () => ({
  backgroundColor: "transparent",
  grid: { left: 32, right: 10, top: 14, bottom: 24 },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const d = props.days[params[0].dataIndex]
      return `${whMd(d.date)} 週${whWeekday(d.date)}<br/>${WH_KIND[kindOf(d)].label} · ${d.log?.hours ?? 0}h`
    },
  },
  xAxis: {
    type: "category",
    data: props.days.map((d) => whMd(d.date)),
    axisLabel: { color: "#94a3b8", fontSize: 10, interval: 0, formatter: (v) => v.slice(3) },
    axisLine: { lineStyle: { color: "#3A4352" } },
    axisTick: { show: false },
  },
  yAxis: {
    type: "value",
    minInterval: 1,
    axisLabel: { color: "#94a3b8", fontSize: 10 },
    splitLine: { lineStyle: { color: "#1E232C" } },
  },
  series: [
    {
      type: "bar",
      barWidth: "60%",
      data: props.days.map((d) => ({
        value: d.log?.hours ?? 0,
        itemStyle: { color: WH_KIND[kindOf(d)].color, borderRadius: [3, 3, 0, 0] },
      })),
    },
  ],
})

const render = () => chart?.setOption(buildOption(), true)

onMounted(() => {
  chart = echarts.init(el.value)
  render()
})
watch(() => props.days, render, { deep: true })
useResizeObserver(el, () => chart?.resize())
onBeforeUnmount(() => {
  chart?.dispose()
  chart = null
})
</script>
