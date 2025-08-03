<template>
  <div class="flex w-full h-full bbb">
    <div class="flex flex-col w-[300px] gap-[8px] aaa">
      <div class="w-full font-[600] text-[20px] text-center">資料修改</div>
      <div class="flex items-center w-full gap-[4px]">
        <div class="whitespace-nowrap">舊資料:</div>
        <el-input type="text" v-model="oldTypeName" clearable size="large" class="w-full" disabled />
      </div>

      <div class="flex items-center w-full gap-[4px]">
        <div class="whitespace-nowrap">新資料:</div>
        <el-input type="text" v-model="newTypeName" clearable size="large" class="w-full" />
      </div>

      <button @click="changeDetail" class="btn" :disabled="oldTypeName.length <= 0">儲存</button>
    </div>

    <div ref="allTypeChartRef" class="flex-1 h-full aaa" />
  </div>
</template>

<script setup>
import * as echarts from 'echarts'

const costDetails = ref({})
const allTypeChartRef = ref(null)
const oldTypeName = ref("")
const newTypeName = ref("")
let chartInstance = null

const renderChart = () => {
  let data = costDetails.value.data.types

  chartInstance.on('legendselectchanged', (params) => {
    oldTypeName.value = params.name
    newTypeName.value = params.name
  })

  const legendData = data.map(item => item.name)
  // https://echarts.apache.org/examples/en/editor.html?c=pie-legend
  chartInstance.setOption({
    title: { text: '各種開銷明細次數', textStyle: { color: 'white' }, left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b} : {c}次 ({d}%)' },
    legend: {
      type: 'scroll',
      orient: 'vertical',        // 垂直排列
      left: 10,
      top: 'middle',             // 垂直居中
      data: legendData,
      textStyle: { color: 'white' },
      // align: "end",
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 14,               // legend 項目間距
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        center: ['70%', '50%'], // 圓餅圖水平,垂直位置 數字越小越靠第二象限
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

const changeDetail = async () => {
  const body = {
    oldTypeName: oldTypeName.value,
    newTypeName: newTypeName.value
  }

  try {
    const response = await useApiStore().put("/api/v1/charts/type", body)
    if (response.code != 0) {
      useToastStore().showToast(`取得開銷細節失敗: ${response.message}`, "error")
    } else {
      await getCostsDetail()
      chartInstance = echarts.init(allTypeChartRef.value)
      renderChart()
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

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>