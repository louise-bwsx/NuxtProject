<template>
  <div class="flex justify-center space-x-5">
    <div v-for="link in gameLinks" :key="link" target="_blank" class="flex flex-col gap-2 mt-3">
      <img :src="link.src" class="w-[160px] h-[160px]">
      <a :href="link.href" rel="noopener noreferrer"
        class="flex flex-col items-center justify-center no-underline text-white text-2xl px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
        {{ link.platform }}
      </a>
    </div>
  </div>
</template>

<script setup>
import steamImg from '~/assets/images/game/逢魔之時Steam.png'
import googlePlayImg from '~/assets/images/game/逢魔之時GooglePlay.png'

const gameLinks = [
  {
    src: steamImg,
    href: 'https://store.steampowered.com/app/1483600/_/',
    platform: 'Steam',
  },
  {
    src: googlePlayImg,
    href: 'https://play.google.com/store/apps/details?id=com.LittleFox.LittleFox&hl=zh_TW',
    platform: 'GooglePlay',
  },
  // {
  //   href: "https://simmer.io/@louise_bws/littlefox",
  //   src: "/static/SimmerQRCode.png",
  //   platform: "Web"
  // },
]
</script>
