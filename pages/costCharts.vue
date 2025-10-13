<template>
  <!-- 20251013 從h-screen改成h-full 避免出現窗雙重卷軸 -->
  <div class="w-full h-full overflow-hidden flex flex-col justify-start items-center">
    <div class="overflow-y-scroll w-full h-full p-0 m-0">
      <YearCostChart />
      <MonthCostChart />
      <AllCostChart />
      <AllCostSumChart />
      <AllTypeChart />
    </div>
  </div>
</template>

<script setup>
import YearCostChart from '~/components/expenditure/charts/YearCostChart.vue';
import MonthCostChart from '~/components/expenditure/charts/MonthCostChart.vue';
import AllCostChart from '~/components/expenditure/charts/AllCostChart.vue';
import AllCostSumChart from '~/components/expenditure/charts/AllCostSumChart.vue';
import AllTypeChart from '~/components/expenditure/charts/AllTypeChart.vue';
</script>
