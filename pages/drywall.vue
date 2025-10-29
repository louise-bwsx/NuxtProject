<template>
  <div class="flex flex-col mx-auto w-full space-y-4 p-6 aaa">
    <div class="text-center">
      <h1 class="text-3xl font-bold">裝潢小工具</h1>
    </div>

    <DryWallCalculator />

    <TaiwanFootConverter />

    <PingConverter />

    <div class=" bg-white rounded-2xl p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">常用參考</h3>
      <div class="space-y-2 text-sm text-gray-600">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span>10 坪</span>
          <span class="font-medium">≈ 33.06 m²</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span>20 坪</span>
          <span class="font-medium">≈ 66.12 m²</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span>30 坪</span>
          <span class="font-medium">≈ 99.17 m²</span>
        </div>
        <div class="flex justify-between py-2">
          <span>1 台尺</span>
          <span class="font-medium">≈ 30.3 cm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TaiwanFootConverter from '~/components/drywall/FootConverter.vue';
import PingConverter from '~/components/drywall/PingConverter.vue';
import DryWallCalculator from '~/components/drywall/DryWallCalculator.vue';
</script>
