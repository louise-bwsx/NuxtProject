<template>
  <div ref="allCostSumChartRef" class="w-full min-h-[380px]" />
</template>

<script setup>
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);
const allCostSumChartRef = ref()
const costNames = ref([])
const costValues = ref([])
let chartInstance = null

const renderChart = () => {
  chartInstance.setOption({
    title: {
      text: '各種開銷明細總和',
      textStyle: {
        color: `white`
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: costNames.value,
        axisTick: {
          alignWithLabel: false
        },
        axisLabel: {
          rotate: -90,      // 旋轉 90 度，文字垂直顯示
          interval: 0,     // 強制顯示所有標籤（避免太多時自動隱藏）
          margin: 10,       // 與軸線的間距，避免貼太近
          color: 'white'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: 'white'
        }
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '25%',
        data: costValues.value
      }
    ],
    dataZoom: [
      {
        type: 'slider',   // 底部的滑動條
        show: true,
        xAxisIndex: [0],
        start: 0,         // 預設顯示的範圍 (0% ~ 100%)
        end: 50           // 例如：先顯示前 50%
      },
      {
        type: 'inside',   // 支援滑鼠滾輪/觸控縮放
        xAxisIndex: [0],
        start: 0,
        end: 50
      }
    ]
  })
}

const getCostsSum = async () => {
  try {
    const response = await useApiStore().get("/api/v1/charts/costSum")
    if (response.code != 0) {
      useToastStore().showToast(`取得支出總和失敗: ${response.message}`, "error")
    }
    costNames.value = response.data.costSum.map(item => item.type)
    costValues.value = response.data.costSum.map(item => item.totalCost)
  } catch (error) {
    console.log(error.message)
    useToastStore().showToast(`不明原因 取得支出總和失敗，請稍後再試: ${error.message}`, "error")
  }
}

onMounted(async () => {
  await getCostsSum()

  chartInstance = echarts.init(allCostSumChartRef.value)

  renderChart()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>
