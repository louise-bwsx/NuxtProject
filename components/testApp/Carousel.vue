<template>
  <div class="relative h-[200px] overflow-hidden">
    <div class="flex w-full h-[200px] transition-transform duration-700"
      :style="{ transform: `translateX(-${(currentSlide - 1) * 100}%)` }">
      <div v-for="index in totalSlides" :key="index" class="w-full flex-shrink-0">
        <img :src="images[index - 1]" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- 指示點 -->
    <div class="absolute bottom-0 flex w-full justify-center gap-2 py-2">
      <button v-for="index in totalSlides" :key="index" @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-colors duration-300"
        :style="{ backgroundColor: currentSlide === index ? '#F8BD13' : '#B3ABA4' }"></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
  "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
  "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
  "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
]

const currentSlide = ref(1)
const totalSlides = images.length
let intervalId = null

const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = currentSlide.value === totalSlides ? 1 : currentSlide.value + 1
}

const startAutoPlay = () => {
  intervalId = setInterval(() => {
    nextSlide()
  }, 2500)
}

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(startAutoPlay)
onUnmounted(stopAutoPlay)
</script>
