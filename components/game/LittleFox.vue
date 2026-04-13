<template>
  <div class="relative overflow-hidden" style="height: calc(100vh - 48px - 60px)">
    <img class="absolute inset-0 w-full h-full object-cover object-center -z-10" src="~/assets/images/game/8.jpg"
      alt="" />
    <div class="absolute inset-0 z-0 bg-black" style="mask-image: linear-gradient(to right, transparent, black 60%)" />

    <div class="relative z-10 flex flex-col md:flex-row h-full overflow-y-auto">
      <!-- 左側連結 -->
      <div class="md:w-1/2 flex flex-col justify-start pt-3 px-4 shrink-0">
        <Link />
      </div>

      <!-- 右側 Carousel + 介紹 -->
      <div class="md:w-1/2 flex flex-col px-3 pt-3 pb-4">

        <!-- Carousel 容器 -->
        <div class="relative w-full rounded-xl overflow-hidden" style="padding-top: 56.25%" @mouseenter="pauseTimer"
          @mouseleave="resumeTimer">
          <div v-for="(slide, index) in slides" :key="index" class="absolute inset-0 transition-opacity duration-500"
            :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'">
            <iframe v-if="slide.type === 'video'" class="w-full h-full" :src="slide.src" title="Littlefox 宣傳影片-逢魔之時"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
            <img v-else class="w-full h-full object-cover" :src="slide.src" :alt="`遊戲截圖 ${index}`" />
          </div>

          <!-- 上一頁按鈕 -->
          <button class="absolute left-2 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 flex items-center justify-center
                   rounded-full bg-black/60 text-white
                   hover:bg-black/80 transition-colors cursor-pointer" @click="prevPage">
            <i class="fa-solid fa-chevron-left text-sm text-white"></i>
          </button>

          <!-- 下一頁按鈕 -->
          <button class="absolute right-2 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 flex items-center justify-center
                   rounded-full bg-black/60 text-white
                   hover:bg-black/80 transition-colors cursor-pointer" @click="nextPage">
            <i class="fa-solid fa-chevron-right text-sm text-white"></i>
          </button>

          <!-- 進度條 -->
          <div class="absolute bottom-0 left-0 h-[3px] bg-blue-500 z-20" :style="{ width: progress + '%' }" />
        </div>

        <!-- 縮圖導覽列 -->
        <div class="flex gap-2 mt-2 overflow-x-auto pb-1 flex-nowrap">
          <button v-for="(slide, index) in slides" :key="index"
            class="shrink-0 w-16 h-10 rounded overflow-hidden border-2 transition-colors" :class="currentSlide === index
              ? 'border-blue-500'
              : 'border-transparent opacity-60 hover:opacity-100'" @click="goToSlide(index)">
            <img v-if="slide.type === 'image'" :src="slide.src" class="w-full h-full object-cover" alt="" />
            <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
              <i class="fa-brands fa-youtube text-white text-lg"></i>
            </div>
          </button>
        </div>

        <!-- 介紹文 -->
        <div class="text-white text-xl mt-3 space-y-1">
          <p>世間萬物，皆為神靈</p>
          <p class="ml-10">日本神道，八百萬神</p>
          <p>以日本八百萬神為故事原型的ＡＲＰＧ。</p>
          <p>千萬技能，四散各地</p>
          <p class="ml-10">囊括依蒨，盡收手心</p>
          <p>探索地圖拿取秘笈，拜師學藝習得技能，</p>
          <p>擊敗Boss掠取能力，蒐集所有技能成為掌握千技之人。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Link from './Link.vue'
import img1 from '~/assets/images/game/1.jpg'
import img2 from '~/assets/images/game/2.jpg'
import img3 from '~/assets/images/game/3.jpg'
import img4 from '~/assets/images/game/4.jpg'
import img5 from '~/assets/images/game/5.jpg'

const slides = [
  { type: 'video', src: 'https://www.youtube.com/embed/pGC87JdJqho?enablejsapi=1' },
  { type: 'image', src: img1 },
  { type: 'image', src: img2 },
  { type: 'image', src: img3 },
  { type: 'image', src: img4 },
  { type: 'image', src: img5 },
]

const INTERVAL = 5000
const TICK = 50

const currentSlide = ref(0)
const progress = ref(0)
const isPaused = ref(false)

let intervalId = null

const startTimer = () => {
  clearInterval(intervalId)
  progress.value = 0

  intervalId = setInterval(() => {
    if (isPaused.value) return

    progress.value += (TICK / INTERVAL) * 100

    if (progress.value >= 100) {
      progress.value = 0
      currentSlide.value = (currentSlide.value + 1) % slides.length
    }
  }, TICK)
}

const goToSlide = (index) => {
  currentSlide.value = index
  startTimer()
}

const prevPage = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
  startTimer()
}

const nextPage = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
  startTimer()
}

const pauseTimer = () => { isPaused.value = true }
const resumeTimer = () => { isPaused.value = false }

onMounted(() => startTimer())
onUnmounted(() => clearInterval(intervalId))
</script>
