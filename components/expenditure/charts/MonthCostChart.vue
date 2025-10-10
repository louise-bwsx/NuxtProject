<template>
  <div ref="monthCostChartRef" class="w-full min-h-[380px]" />
</template>

<script setup>
import { getMonthCost } from '~/api/chart';
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

const monthCostChartRef = ref(null)
let chartInstance = null
const dayList = ref([])
const costList = ref([])
const detailList = ref([])

const renderChart = () => {
  chartInstance.setOption({
    title: {
      text: '每月支出',
      textStyle: {
        color: `white`
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const dataIndex = params[0].dataIndex
        const detail = detailList.value[dataIndex]
        const date = dayList.value[dataIndex]

        let html = `<div class="font-bold mb-[8px]">${date}</div>`

        if (detail.breakfastCost > 0) {
          html += `<div>早餐${detail.breakfastType ? ` (${detail.breakfastType})` : ''}: $${detail.breakfastCost}</div>`
        }
        if (detail.lunchCost > 0) {
          html += `<div>午餐${detail.lunchType ? ` (${detail.lunchType})` : ''}: $${detail.lunchCost}</div>`
        }
        if (detail.dinnerCost > 0) {
          html += `<div>晚餐${detail.dinnerType ? ` (${detail.dinnerType})` : ''}: $${detail.dinnerCost}</div>`
        }
        if (detail.extraCost > 0) {
          html += `<div>額外${detail.extraType ? ` (${detail.extraType})` : ''}: $${detail.extraCost}</div>`
        }

        html += `<div class="font-bold mt-[8px] pt-[8px] border-t-1 border-t-[#ccc]">總和: $${detail.totalCost}</div>`

        return html
      }
    },
    legend: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dayList.value,
      axisLabel: {
        color: `white`
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: `white`
      }
    },
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
  const response = await getMonthCost()
  if (response.code != 0) {
    useToastStore().showToast(`取得每週支出失敗`, `error`)
    return
  }
  dayList.value = response.data.dayList
  costList.value = response.data.costList
  detailList.value = response.data.detailList

  chartInstance = echarts.init(monthCostChartRef.value)
  renderChart()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>
