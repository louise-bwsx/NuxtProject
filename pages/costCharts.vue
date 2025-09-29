<template>
  <div class="w-full h-screen overflow-hidden flex flex-col justify-start items-center">
    <div class="overflow-y-scroll w-full h-full p-0 m-0">
      <AllCostChart />
      <AllCostSumChart />
      <AllTypeChart />
    </div>
  </div>
</template>

<script setup>
import AllCostChart from '~/components/expenditure/charts/AllCostChart.vue';
import AllCostSumChart from '~/components/expenditure/charts/AllCostSumChart.vue';
import AllTypeChart from '~/components/expenditure/charts/AllTypeChart.vue';
</script>