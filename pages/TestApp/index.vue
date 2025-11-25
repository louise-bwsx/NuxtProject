<template>
  <div class="w-full h-full overflow-y-scroll overflow-hidden">
    <Carousel />
    <SearchBar />
    <Service />
    <LearnMore />
    <!-- <div class="text-black">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos fuga quam, unde
      reiciendis minima,
      doloremque odio error voluptatem quibusdam expedita neque veritatis? Incidunt consequatur iste voluptate sit
      laboriosam culpa. Necessitatibus!</div>
    <div class="text-black">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos fuga quam, unde
      reiciendis minima,
      doloremque odio error voluptatem quibusdam expedita neque veritatis? Incidunt consequatur iste voluptate sit
      laboriosam culpa. Necessitatibus!</div>
    <div class="text-black">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos fuga quam, unde
      reiciendis minima,
      doloremque odio error voluptatem quibusdam expedita neque veritatis? Incidunt consequatur iste voluptate sit
      laboriosam culpa. Necessitatibus!</div>
    <div class="text-black">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos fuga quam, unde
      reiciendis minima,
      doloremque odio error voluptatem quibusdam expedita neque veritatis? Incidunt consequatur iste voluptate sit
      laboriosam culpa. Necessitatibus!</div> -->
  </div>
</template>

<script setup>
import Carousel from '~/components/testApp/Carousel.vue';
import SearchBar from '~/components/testApp/SearchBar.vue';
import Service from '~/components/testApp/Service.vue';
import LearnMore from '~/components/testApp/LearnMore.vue';

// 指定這個頁面使用 BLayout
definePageMeta({
  layout: 'test-app'
})
</script>
