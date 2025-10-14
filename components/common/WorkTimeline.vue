<template>
  <ul ref="timelineRef" class="timeline overflow-x-scroll overflow-hidden">
    <li v-for="(data, index) in pointList" :key="index">
      <hr v-if="index != 0" />
      <div :class="index % 2 == 0 ? 'timeline-start' : 'timeline-end'">{{ data.start }} ~ {{ data.end }}</div>
      <div class="timeline-middle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd" />
        </svg>
      </div>
      <div :class="index % 2 == 0 ? 'timeline-end' : 'timeline-start'" class="timeline-box">
        {{ data.point }}
      </div>
      <hr />
    </li>
  </ul>
</template>

<script setup>
const pointList = ref([
  {
    start: "2017/08",
    end: "2020/06",
    point: "宏國室內裝修", // 2年11個月
  },
  {
    start: "2021/01/04",
    end: "2021/07/30",
    point: "曉兔科技", // 7個月
  },
  {
    start: "2021/08/03",
    end: "2021/09/30",
    point: "奧奇盟科技", // 2個月
  },
  {
    start: "2021/10/01",
    end: "2022/06/30",
    point: "村宏室內裝修",
  },
  {
    start: "2022/09/07",
    end: "2022/09/16",
    point: "某個自走車",
  },
  {
    start: "2022/09/17",
    end: "2023/10/30",
    point: "村宏室內裝修",
  },
  {
    start: "2023/11/08",
    end: "2023/12/27",
    point: "閎裝潢",
  },
  {
    start: "2024/01/03",
    end: "2024/06/30",
    point: "深哥裝潢",
  },
  {
    start: "2024/07/12",
    end: "2024/10/17",
    point: "職訓網頁全端",
  },
  {
    start: "2024/11/01",
    end: "2025/09/30",
    point: "夢市集軟體技術",
  },
])

const timelineRef = ref(null)


onMounted(() => {
  if (timelineRef.value) {
    timelineRef.value.scrollLeft = timelineRef.value.scrollWidth
  }
})
</script>
