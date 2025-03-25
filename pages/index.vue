<template>
  <div
    class="bbb min-h-screen overflow-hidden flex justify-center items-center"
  >
    <!-- TODO: 網址需要可以大小寫不分 -->
    <NuxtLink
      to="/incomeReport"
      onclick="console.log(111)"
      class="btn btn-primary"
    >
      收支圖表 已更新https
    </NuxtLink>
  </div>
</template>

<script>
import { NuxtLink } from "#components";
</script>
