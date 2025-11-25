<template>
  <div class="pb-2 bg-white">
    <div class="flex justify-between ms-2 mb-2">
      <p class="text-lg font-semibold text-[#252525]">最新部落格文章</p>
      <button class="flex items-center">
        <p class="text-sm font-normal text-[#398AF9]">查看更多</p>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#398AF9">
          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </svg>
      </button>
    </div>

    <!-- 文章列表 -->
    <div class="flex justify-start w-full overflow-y-hidden space-x-2">
      <div v-for="blog in blogList" :key="blog" class="ms-2">
        <div class="w-[300px] h-[200px] rounded-xl bg-no-repeat bg-center" :style="{
          backgroundImage: `url(${blog.image})`,
          backgroundSize: 'auto 100%'
        }">
          <div
            class="text-[#181818] text-sm text-normal mt-[10px] bg-[#F8BF14] w-fit rounded-br-sm rounded-tr-sm px-2 py-[2px]">
            好物分享
          </div>
        </div>
        <div class="text-[#181818] text-sm text-normal">{{ blog.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const blogList = [
  { tag: "好物分享", title: "全新升級 | 木芯板系統櫃:木作的靈魂", image: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" },
  { tag: "知識庫", title: "水電師傅的真心話: 一捲好用的電火布", image: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp" },
  { tag: "好物分享", title: "別在抖著洗澡了", image: "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp" },
  { tag: "好物分享", title: "你刷劇,他們刷單", image: "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp" }
]
</script>
