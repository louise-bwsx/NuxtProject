<template>
  <div class="w-full min-h-screen p-4">
    <!-- 標題區域 -->
    <div class="mb-4">
      <h1 class="text-xl font-bold text-center mb-2">所有開銷明細次數</h1>

      <!-- 篩選控制區 -->
      <div class="bg-gray-900 rounded-lg p-4 space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">忽略次數低於</label>
          <div class="flex items-center gap-2">
            <button @click="decrementThreshold"
              class="w-8 h-8 bg-gray-700 rounded-lg hover:bg-gray-600 active:bg-gray-500 transition-colors"
              :disabled="threshold <= 1 || loading"
              :class="{ 'opacity-50 cursor-not-allowed': threshold <= 1 || loading }">
              -
            </button>
            <span class="font-bold text-lg min-w-[3rem] text-center">{{ threshold }}</span>
            <button @click="incrementThreshold"
              class="w-8 h-8 bg-gray-700 rounded-lg hover:bg-gray-600 active:bg-gray-500 transition-colors"
              :disabled="loading" :class="{ 'opacity-50 cursor-not-allowed': loading }">
              +
            </button>
          </div>
        </div>

        <div class="border-b border-gray-700" />

        <!-- 統計資訊 -->
        <div class="flex justify-between text-xs">
          <span>顯示項目: {{ filteredData.length }}</span>
          <span v-if="loading" class="text-blue-400">載入中...</span>
        </div>
      </div>
    </div>

    <div class="md:flex md:gap-4">
      <!-- 圖表容器 -->
      <div ref="allTypeChartRef" class="w-full h-[380px] rounded-lg bbb" />

      <!-- 圖例列表 -->
      <div class="md:mt-0 mt-4 bg-gray-900 rounded-lg h-[380px] p-4 flex flex-col">
        <h2 class="text-sm font-bold mb-3 flex-shrink-0">項目列表</h2>
        <div class="space-y-2 overflow-y-auto flex-1">
          <div v-for="(item, index) in filteredData" :key="index"
            class="flex items-center justify-between p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <span class="text-sm truncate">{{ item.name }}</span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-sm font-bold">{{ item.value }}次</span>
              <span class="text-xs">{{ getPercentage(item.value) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const costDetails = ref({ data: { types: [] } })
const allTypeChartRef = ref(null)
const threshold = ref(5) // 預設5次
const loading = ref(false) // 載入狀態
let chartInstance = null

// 計算過濾後的資料
const filteredData = computed(() => {
  if (!costDetails.value.data?.types) return []
  return costDetails.value.data.types
})

// 計算總數
const totalValue = computed(() => {
  return filteredData.value.reduce((sum, item) => sum + item.value, 0)
})

// 計算百分比
const getPercentage = (value) => {
  if (totalValue.value === 0) return 0
  return ((value / totalValue.value) * 100).toFixed(1)
}

// 增加閾值
const incrementThreshold = async () => {
  threshold.value++
  await getCostsDetail()
}

// 減少閾值
const decrementThreshold = async () => {
  if (threshold.value > 1) {
    threshold.value--
    await getCostsDetail()
  }
}

const renderChart = () => {
  if (!chartInstance) return

  const data = filteredData.value

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}次 ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#fff',
          fontSize: 11
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          lineStyle: {
            color: '#666'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#1e293b',
          borderWidth: 2
        }
      }
    ]
  })
}

const getCostsDetail = async () => {
  loading.value = true
  try {
    // 帶上 threshold 參數
    costDetails.value = await useApiStore().get(`/api/v1/charts/type?threshold=${threshold.value}`)
    if (costDetails.value.code != 0) {
      useToastStore().showToast(`取得開銷細節失敗: ${costDetails.value.message}`, "error")
    } else {
      // 資料更新後重新渲染圖表
      nextTick(() => {
        renderChart()
      })
    }
  } catch (error) {
    console.error(error.message)
    useToastStore().showToast(`不明原因 取得開銷細節失敗，請稍後再試: ${error.message}`, "error")
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getCostsDetail()

  chartInstance = echarts.init(allTypeChartRef.value, 'dark')
  renderChart()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', chartInstance?.resize)
})
</script>
