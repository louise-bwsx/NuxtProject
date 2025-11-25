<template>
  <div class="w-screen h-full pb-40 overflow-y-scroll">
    <Carousel />
    <SearchBar />
    <Service />
    <LearnMore />
    <BlogList />
    <Assure />
  </div>
</template>

<script setup>
import Carousel from '~/components/testApp/Carousel.vue';
import SearchBar from '~/components/testApp/SearchBar.vue';
import Service from '~/components/testApp/Service.vue';
import LearnMore from '~/components/testApp/LearnMore.vue';
import BlogList from '~/components/testApp/BlogList.vue';
import Assure from '~/components/testApp/Assure.vue';

// 指定這個頁面使用 BLayout
definePageMeta({
  layout: 'test-app'
})
</script>
