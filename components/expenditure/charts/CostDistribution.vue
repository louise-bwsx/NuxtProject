<template>
  <div ref="costDistributionRef" class="w-full min-h-[380px]" />
</template>

<script setup>
import { getCostDistribution } from '~/api/chart';
// 使用的圖表為: World Population
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

const costDistributionRef = ref(null)
let chartInstance = null
const yAxisData = ref([])
const series = ref([])

const renderChart = () => {
  chartInstance.setOption({
    title: { text: '每月支出分佈' },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: yAxisData.value,
    },
    series: series.value
  })
}

onMounted(async () => {
  const response = await getCostDistribution()
  if (response.code != 0) {
    useToastStore().showToast(`取得每日支出分佈失敗`, `error`)
    return
  }

  yAxisData.value = response.data.yAxisData
  series.value = response.data.series

  chartInstance = echarts.init(costDistributionRef.value, 'dark')
  renderChart()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>
