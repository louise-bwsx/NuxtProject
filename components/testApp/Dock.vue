<template>
  <div class="relative flex aaa">
    <div class="dock bg-[#1F276F] text-neutral-content">
      <NuxtLink to="/TestApp">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
          :fill="route.path == '/TestApp' || route.path == '/TestApp/' ? '#F8BF14' : 'white'">
          <path
            d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
        </svg>
        <span class="dock-label">首頁</span>
      </NuxtLink>

      <NuxtLink to="/TestApp/Order">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
          :fill="route.path == '/TestApp/Order' ? '#F8BF14' : 'white'">
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z" />
        </svg>
        <span class="dock-label">訂單</span>
      </NuxtLink>

      <NuxtLink to="/TestApp/Tutorial">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
          :fill="route.path == '/TestApp/Notification' ? '#F8BF14' : 'white'">
          <path
            d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
        </svg>
        <span class="dock-label">下單流程</span>
      </NuxtLink>

      <NuxtLink to="/TestApp/Notification">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
          :fill="route.path == '/TestApp/Notification' ? '#F8BF14' : 'white'">
          <path
            d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
        </svg>
        <span class="dock-label">通知</span>
      </NuxtLink>

      <NuxtLink to="/TestApp/Account">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
          :fill="route.path == '/TestApp/Account' ? '#F8BF14' : 'white'">
          <path
            d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
        </svg>
        <span class="dock-label">帳號</span>
      </NuxtLink>
    </div>

    <!-- 圖案群組（置中＋半圓突出） -->
    <!-- <div class="absolute left-1/2 top-0 -translate-x-1/2 flex items-end gap-0 z-20 aaa"> -->
    <!-- 群組頂部跟在dock頂部 -->
    <div class="absolute left-1/2 -bottom-2 -translate-x-1/2 -translate-y-1/1 flex items-end gap-0 z-20">
      <!-- <div class="absolute left-1/2 bottom-18 -translate-x-1/2 -translate-y-1/2 flex items-end gap-0 z-20 aaa"> -->
      <div id="curved-corner-bottomright" class="absolute -top-[33px] left-[10px]" />
      <div @click="console.log('aaa')" id="circle" />
      <div id="curved-corner-bottomleft" class="absolute -top-[33px] right-[10px]" />
    </div>
  </div>
</template>

<script setup>
import { NuxtLink } from '#components';
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<style scoped>
#curved-corner-bottomleft,
#curved-corner-bottomright {
  width: 40px;
  height: 40px;
  overflow: hidden;
  position: relative;
}

#curved-corner-bottomleft:before,
#curved-corner-bottomright:before {
  content: "";
  display: block;
  width: 200%;
  height: 200%;
  position: absolute;
  border-radius: 50%;
}

#curved-corner-bottomleft:before {
  bottom: 0;
  left: 0;
  /* box-shadow: -50px 50px 0 0 red; */
  box-shadow: -50px 50px 0 0 #1F276F;
}

#curved-corner-bottomright:before {
  bottom: 0;
  right: 0;
  /* box-shadow: 50px 50px 0 0 red; */
  box-shadow: 50px 50px 0 0 #1F276F;
}

#circle {
  width: 75px;
  height: 75px;
  /* background: red; */
  background: #1F276F;
  border-radius: 50%
}
</style>
