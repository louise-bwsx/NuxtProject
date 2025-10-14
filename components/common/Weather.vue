<template>
  <div class="flex flex-col items-center w-full space-y-2">
    <div class="flex flex-col items-center">
      <div class="flex justify-center items-center">
        <img src="https://cdn.weatherapi.com/weather/64x64/day/116.png" alt="weather">
        <h1 class="text-lg font-bold">天氣預報</h1>
      </div>
      <p class="text-xs text-base-content/60">即時天氣資訊與預報</p>
    </div>

    <div class="relative flex justify-center items-center">
      <el-input type="text" v-model="input" placeholder="地區" size="large" @keydown.enter.exact="search"
        @compositionstart="isComposing = true" @compositionend="isComposing = false" @focus="isFocus = true"
        @blur="isFocus = false" />
      <button @click="search" class="absolute right-2 w-[20px] h-[20px]">
        <!-- search_40_40_white 為了修改顏色 -->
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
          :fill="isFocus ? '#409eff' : '#dcdfe6'" class="transition-all">
          <path
            d="M792-120.67 532.67-380q-30 25.33-69.64 39.67Q423.39-326 378.67-326q-108.44 0-183.56-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.5-75.17 107.33 0 182.16 75.17 74.84 75.17 74.84 182.27 0 43.23-14 82.9-14 39.66-40.67 73l260 258.66-48 48Zm-414-272q79.17 0 134.58-55.83Q568-504.33 568-583.33q0-79-55.42-134.84Q457.17-774 378-774q-79.72 0-135.53 55.83-55.8 55.84-55.8 134.84t55.8 134.83q55.81 55.83 135.53 55.83Z" />
        </svg>
      </button>
    </div>

    <div v-if="dataLocation && dataCurrent" class="flex flex-col space-y-4 w-full">
      <div class="flex justify-between glass rounded-2xl p-4">
        <div class="flex flex-col justify-between">
          <h1 class="text-lg font-bold">{{ dataLocation.country }}</h1>
          <p class="text-xs text-base-content/60">{{ dataCurrent.last_updated }}</p>
        </div>

        <div class="flex flex-col items-end h-full">
          <div class="flex justify-between h-full">
            <img :src="`https:${dataCurrent.condition.icon}`" alt="condition">
            <div class="flex flex-col justify-center">
              <h1 class="text-lg font-bold">{{ dataCurrent.temp_c }}°C</h1>
              <p class="text-xs text-base-content/60">{{ dataCurrent.condition.text }}</p>
            </div>
          </div>
          <h1 class="text-sm font-bold">體感溫度: {{ dataCurrent.feelslike_c }}°C</h1>
        </div>
      </div>

      <div class="flex space-x-2">
        <div class="flex flex-col justify-between glass rounded-2xl p-4 w-full">
          <div class="flex items-center space-x-2">
            <img src="~/assets/icons/wind_40_40_white.svg" alt="wind" class="w-[20px] h-[20px]">
            <h1 class="text-md font-bold">風速</h1>
          </div>
          <h1 class="text-lg font-bold">
            {{ dataCurrent.wind_kph }}
            <span class="text-xs text-base-content/60">km/h</span>
          </h1>
        </div>

        <div class="flex flex-col justify-between glass rounded-2xl p-4 w-full">
          <div class="flex items-center space-x-2">
            <img src="~/assets/icons/waterDrop_40_40_white.svg" alt="wind" class="w-[20px] h-[20px]">
            <h1 class="text-md font-bold">濕度</h1>
          </div>
          <h1 class="text-lg font-bold">
            {{ dataCurrent.humidity }}
            <span class="text-xs text-base-content/60">%</span>
          </h1>
        </div>

        <div class="flex flex-col justify-between glass rounded-2xl p-4 w-full">
          <div class="flex items-center space-x-2">
            <img src="~/assets/icons/airPressure_64_64_white.svg" alt="wind" class="w-[20px] h-[20px]">
            <h1 class="text-md font-bold">氣壓</h1>
          </div>
          <h1 class="text-lg font-bold">
            {{ dataCurrent.pressure_mb }}
            <span class="text-xs text-base-content/60">mb</span>
          </h1>
        </div>
      </div>

      <div class="flex space-x-2">
        <div class="flex flex-col justify-between glass rounded-2xl p-4 w-full">
          <div class="flex items-center space-x-2">
            <img src="~/assets/icons/visibility_24_24_white.svg" alt="wind" class="w-[20px] h-[20px]">
            <h1 class="text-md font-bold">能見度</h1>
          </div>
          <h1 class="text-lg font-bold">
            {{ dataCurrent.vis_km }}
            <span class="text-xs text-base-content/60">km</span>
          </h1>
        </div>

        <div class="flex flex-col justify-between glass rounded-2xl p-4 w-full">
          <div class="flex items-center space-x-2">
            <img src="~/assets/icons/brightness_24_24_white.svg" alt="wind" class="w-[20px] h-[20px]">
            <h1 class="text-md font-bold">紫外線指數</h1>
          </div>
          <h1 class="text-lg font-bold">
            {{ dataCurrent.uv }}
            <span class="text-xs text-base-content/60">
              {{
                dataCurrent.uv < 2 ? '低量級' : dataCurrent.uv <= 5 ? '中量級' : dataCurrent.uv <= 7 ? '高量級' : dataCurrent.uv <= 10
                  ? '過量級' : '危險級' }} </span>
          </h1>
        </div>
      </div>

      <div class="flex space-x-2">
        <div class="flex flex-col justify-between glass rounded-2xl p-4 w-full">
          <div class="flex items-center space-x-2">
            <img src="~/assets/icons/cloud_24_24_white.svg" alt="wind" class="w-[20px] h-[20px]">
            <h1 class="text-md font-bold">雲量</h1>
          </div>
          <h1 class="text-lg font-bold">
            {{ dataCurrent.cloud }}
            <span class="text-xs text-base-content/60">%</span>
          </h1>
        </div>

        <div class="flex flex-col justify-between glass rounded-2xl p-4 w-full">
          <h1 class="text-md font-bold">
            經度
            <span class="text-xs text-base-content/60">{{ dataLocation.lon }}</span>
          </h1>
          <h1 class="text-md font-bold">
            緯度
            <span class="text-xs text-base-content/60">{{ dataLocation.lat }}</span>
          </h1>
          <h1 class="text-md font-bold">
            時區代號
            <span class="text-xs text-base-content/60">{{ dataLocation.tz_id }}</span>
          </h1>
        </div>
      </div>
    </div>
    <!-- https://api.weatherapi.com/v1/current.json?q=%E5%8F%B0%E7%81%A3&lang=zh_tw&key=f6e7df8b4efe43b19cf95930251308 -->
    <!-- 剩下的response參數 -->
    <!-- {
      "location": {
        "name": "後灣",
        "region": "T'ai-wan",
        "localtime_epoch": 1760432551,
      },
      "current": {
        "last_updated_epoch": 1760432400,
        "last_updated": "2025-10-14 17:00",
        "temp_f": 88.3,
        "is_day": 1,
        "condition": {
          "code": 1003
        },
        "wind_mph": 14.3,
        "wind_degree": 58,
        "pressure_in": 29.85,
        "precip_mm": 0.32,
        "precip_in": 0.01,
        "wind_dir": ENE
        "feelslike_f": 103.7,
        "windchill_c": 28.8,
        "windchill_f": 83.8,
        "heatindex_c": 33.4,
        "heatindex_f": 92.1,
        "dewpoint_c": 24.1,
        "dewpoint_f": 75.4,
        "vis_miles": 6,
        "gust_mph": 19.1,
        "gust_kph": 30.7
      }
    } -->
  </div>
</template>

<script setup>
import { current } from '~/api/weather'

const input = ref("")
const isComposing = ref(true)
const isFocus = ref(false)

const dataLocation = ref(null)
const dataCurrent = ref(null)

const search = async () => {
  if (isComposing.value) {
    return
  }

  const response = await current(input.value)
  if (response.status) {
    useToastStore().showToast(response.data.error.message, `error`)
    return
  }

  dataLocation.value = response.location
  dataCurrent.value = response.current
}

onMounted(async () => {
  input.value = `台灣`
  isComposing.value = false
  await search()
})
</script>
