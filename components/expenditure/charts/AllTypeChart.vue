<template>
  <div ref="allTypeChartRef" class="w-full h-full" />
</template>

<script setup>
import * as echarts from 'echarts'

const costDetails = ref({})
const options = ref([])
const allTypeChartRef = ref()
let chartInstance = null
const selectedIndex = ref(-1)

function addOption(option) {
  if (option && !options.value.includes(option)) {
    options.value.push(option)
    renderChart()
  }
  // optionInput.value = ''
}

const renderChart = () => {
  let data = costDetails.value.data.types
  // chartInstance.off('click') // 移除所有 click handler（只加一次）
  // chartInstance.on('click', (params) => {
  //   if (params.componentType === 'series' && params.seriesType === 'pie') {
  //     selectedIndex.value = params.dataIndex
  //     removeOption(selectedIndex.value)
  //   }
  // })

  const legendData = data.map(item => item.name)
  // https://echarts.apache.org/examples/en/editor.html?c=pie-legend
  chartInstance.setOption({
    title: { text: '各種開銷細節次數', textStyle: { color: 'white' }, left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b} : {c}次 ({d}%)' },
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
        radius: '25%',
        // center: ['25%', '50%'],   // 圖表位置：左側 35%，垂直居中
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

const getCostsDetail = async () => {
  try {
    costDetails.value = await useApiStore().get("/api/v1/charts/type")
    if (costDetails.value.code != 0) {
      useToastStore().showToast(`取得開銷細節失敗: ${response.message}`, "error")
    }
  } catch (error) {
    console.log(error.message)
    useToastStore().showToast(`不明原因 取得開銷細節失敗，請稍後再試: ${error.message}`, "error")
  }
}

onMounted(async () => {
  await getCostsDetail()

  chartInstance = echarts.init(allTypeChartRef.value)
  renderChart()

  // 預設選項
  // addOption("A")
  // addOption("B")
  // addOption("C")
  // addOption("D")

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>