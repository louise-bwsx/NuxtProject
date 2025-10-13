<template>
  <div ref="yearCostChartRef" class="w-full min-h-[380px]" />
</template>

<script setup>
import { getYearCost } from '~/api/chart';
// 使用的圖表為: Temperature Change in the Coming Week
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);
const yearCostChartRef = ref(null)
let chartInstance = null
const monthList = ref([])
const costList = ref([])

const renderChart = () => {
  // https://echarts.apache.org/examples/en/editor.html?c=pie-legend
  chartInstance.setOption({
    title: { text: '每月支出總和' },
    tooltip: { trigger: 'axis' },
    legend: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthList.value,
    },
    yAxis: { type: 'value', },
    series: [
      {
        type: 'line',
        data: costList.value,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        },
      },
    ]
  })
}

onMounted(async () => {
  const response = await getYearCost()
  if (response.code != 0) {
    useToastStore().showToast(`取得每月支出失敗`, `error`)
    return
  }
  monthList.value = response.data.monthList
  costList.value = response.data.costList

  chartInstance = echarts.init(yearCostChartRef.value, `dark`)
  renderChart()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>
