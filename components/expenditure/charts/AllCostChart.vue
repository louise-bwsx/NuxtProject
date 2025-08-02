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

  const legendData = data.map(item => item.name)
  // https://echarts.apache.org/examples/en/editor.html?c=pie-legend
  chartInstance.setOption({
    title: { text: '各類型總支出', textStyle: { color: 'white' }, left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b} : {c}元 ({d}%)' },
    legend: {
      type: 'scroll',
      orient: 'vertical',        // 垂直排列
      right: 50,                 // 距離右邊 50px
      top: 'middle',             // 垂直居中
      data: legendData,
      textStyle: { color: 'white' },
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 15               // legend 項目間距
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        center: ['35%', '50%'],   // 圖表位置：左側 35%，垂直居中
        data,
        labelLine: {
          show: true, // ✅ 關閉連線
          position: 'inside'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
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