<template>
  <div class="p-4 my-2 bg-white">
    <div class="text-lg font-semibold text-[#252525] mb-4">我們提供給客戶的保障</div>

    <div class="space-y-4 pb-4">
      <div v-for="item in list" :key="item" class="flex space-x-4">
        <div class="w-[50px] h-[50px] aaa">{{ item.image }}</div>
        <div class="flex flex-1 flex-col">
          <div class="text-lg font-semibold text-[#252525]">{{ item.title }}</div>
          <div class="text-sm font-normal text-[#9F9F9F]">{{ item.description }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

const list = [
  {
    image: "",
    title: "1預先掌握行情範圍",
    description: "想找最便宜卻被事後追加您是否感到受騙？獅虎平台公開各宮向參考價格 您的心裡也有底讓您不再當冤大頭",
  },
  {
    image: "",
    title: "2預先掌握行情範圍",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit ipsum perspiciatis delectus, aperiam veritatis dolor magnam magni officia laboriosam aspernatur quibusdam accusantium? Porro nostrum mollitia, sapiente maiores sed voluptates harum.",
  },
  {
    image: "",
    title: "3預先掌握行情範圍",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit ipsum perspiciatis delectus, aperiam veritatis dolor magnam magni officia laboriosam aspernatur quibusdam accusantium? Porro nostrum mollitia, sapiente maiores sed voluptates harum.",
  },
  {
    image: "",
    title: "4預先掌握行情範圍",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit ipsum perspiciatis delectus, aperiam veritatis dolor magnam magni officia laboriosam aspernatur quibusdam accusantium? Porro nostrum mollitia, sapiente maiores sed voluptates harum.",
  },
  {
    image: "",
    title: "5預先掌握行情範圍",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit ipsum perspiciatis delectus, aperiam veritatis dolor magnam magni officia laboriosam aspernatur quibusdam accusantium? Porro nostrum mollitia, sapiente maiores sed voluptates harum.",
  },
  {
    image: "",
    title: "6預先掌握行情範圍",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit ipsum perspiciatis delectus, aperiam veritatis dolor magnam magni officia laboriosam aspernatur quibusdam accusantium? Porro nostrum mollitia, sapiente maiores sed voluptates harum.",
  },
]
</script>
