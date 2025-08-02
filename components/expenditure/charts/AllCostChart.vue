<template>
  <div ref="allCostChartRef" class="w-full h-full" />
</template>

<script setup>
import * as echarts from 'echarts'

const costsType = ref({})
const allCostChartRef = ref()
let chartInstance = null

const renderChart = () => {
  let data = []
  data.push(costsType.value.data.breakfastCost)
  data.push(costsType.value.data.lunchCost)
  data.push(costsType.value.data.dinnerCost)
  data.push(costsType.value.data.extraCost)

  chartInstance.setOption({
    tooltip: { trigger: 'item', },
    series: [
      {
        type: 'pie',
        radius: '100%',
        data,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 14,
          formatter: '{b}',
        },
        labelLine: {
          show: true, // ✅ 關閉連線
          position: 'inside'
        },
        emphasis: {
          scale: false, // 避免hover時的動畫才切
          itemStyle: {
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowColor: 'transparent'
          },
        }
      }
    ]
  })
}

const getCostsSum = async () => {
  try {
    costsType.value = await useApiStore().get("/api/v1/charts/cost")
    if (costsType.value.code != 0) {
      useToastStore().showToast(`取得開銷總和失敗: ${response.message}`, "error")
    }
  } catch (error) {
    console.log(error.message)
    useToastStore().showToast(`不明原因 取得開銷總和失敗，請稍後再試: ${error.message}`, "error")
  }
}

onMounted(async () => {
  await getCostsSum()

  chartInstance = echarts.init(allCostChartRef.value)
  renderChart()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>