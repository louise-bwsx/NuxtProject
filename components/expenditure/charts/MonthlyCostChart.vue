<template>
  <div ref="monthlyCostChartRef" class="w-full min-h-[380px] bbb" />
</template>

<script setup>
import { getMonthlyCost } from '~/api/chart';
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
import { color } from 'echarts';

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
const monthlyCostChartRef = ref(null)
let chartInstance = null
const monthMap = ref([])
const costMap = ref([])

const renderChart = () => {
  // https://echarts.apache.org/examples/en/editor.html?c=pie-legend
  chartInstance.setOption({
    title: {
      text: '每月支出',
      textStyle: {
        color: `rgba(223,223,225,1)`
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthMap.value,
      axisLabel: {
        color: `rgba(223,223,225,1)`
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: `rgba(223,223,225,1)`
      }
    },
    series: [
      {
        name: 'Highest',
        type: 'line',
        data: costMap.value,
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
      // {
      //   name: 'Lowest',
      //   type: 'line',
      //   data: [1, -2, 2, 5, 3, 2, 0],
      //   markPoint: {
      //     data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
      //   },
      //   markLine: {
      //     data: [
      //       { type: 'average', name: 'Avg' },
      //       [
      //         {
      //           symbol: 'none',
      //           x: '90%',
      //           yAxis: 'max'
      //         },
      //         {
      //           symbol: 'circle',
      //           label: {
      //             position: 'start',
      //             formatter: 'Max'
      //           },
      //           type: 'max',
      //           name: '最高点'
      //         }
      //       ]
      //     ]
      //   }
      // }
    ]
  })
}

onMounted(async () => {
  const response = await getMonthlyCost()
  console.log(`response: ${JSON.stringify(response)} `);
  if (response.code != 0) {
    useToastStore().showToast(`取得每月支出失敗`, `error`)
    return
  }
  monthMap.value = response.data.monthMap
  costMap.value = response.data.costMap

  chartInstance = echarts.init(monthlyCostChartRef.value)
  renderChart()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>
