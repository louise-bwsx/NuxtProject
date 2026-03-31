<template>
  <!-- 20251013 從h-screen改成h-full 避免出現窗雙重卷軸 -->
  <div class="w-full h-full overflow-hidden flex flex-col justify-start items-center bg-[#040810]">
    <div class="overflow-y-scroll w-full h-full p-0 m-0">
      <CostDistribution />
      <YearCostChart />
      <MonthCostChart />
      <AllCostChart />
      <AllCostSumChart />
      <AllTypeChart />
    </div>
  </div>
</template>

<script setup>
// 20260331 為了優化打包大小 全部改成動態import 讓每個元件獨立chunk 不再塞進同一包
// 全部改成動態 import，讓每個元件獨立 chunk，不再塞進同一包
const CostDistribution = defineAsyncComponent(() => import('~/components/expenditure/charts/CostDistribution.vue'))
const YearCostChart = defineAsyncComponent(() => import('~/components/expenditure/charts/YearCostChart.vue'))
const MonthCostChart = defineAsyncComponent(() => import('~/components/expenditure/charts/MonthCostChart.vue'))
const AllCostChart = defineAsyncComponent(() => import('~/components/expenditure/charts/AllCostChart.vue'))
const AllCostSumChart = defineAsyncComponent(() => import('~/components/expenditure/charts/AllCostSumChart.vue'))
const AllTypeChart = defineAsyncComponent(() => import('~/components/expenditure/charts/AllTypeChart.vue'))


usePageSeo({
  title: '開銷圖表',
  description: '開銷圖表',
  url: 'https://www.louise.tw/costCharts'
})
</script>
