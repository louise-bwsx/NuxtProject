<template>
  <div class="bbb w-full flex flex-col justify-start items-center">
    <AllCostChart />
    <Toast />
  </div>
</template>

<script setup>
import Toast from '~/components/common/Toast.vue';
import AllCostChart from '~/components/expenditure/charts/AllCostChart.vue';
</script>