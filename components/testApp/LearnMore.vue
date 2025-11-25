<template>
  <div class="bg-no-repeat bg-[#E0E4E6] h-[180px] bg-right rounded-md mx-2 shadow-md" :style="{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'auto 100%',
    backgroundPosition: 'right center'
  }">
    <div class="flex flex-col justify-center h-full pl-8 space-y-6">
      <div>
        <div class="text-[#252525] text-xl font-semibold">我們如何提供您</div>
        <div class="text-[#252525] text-xl font-semibold">可靠的服務？</div>
      </div>
      <button class="btn bg-[#398AF9] w-fit shadow-none border-none font-normal ">了解更多</button>
    </div>
  </div>
</template>

<script setup>
import bgImage from '~/assets/images/testApp/learnMore.png'
</script>
