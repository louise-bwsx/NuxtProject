<template>
  <!-- IncomeReport -->
  <div
    class="bbb min-h-screen overflow-hidden overflow-y-hidden flex flex-col justify-center items-center"
  >
    <div class="bbb flex flex-row grow w-full">
      <!-- <div class="bbb">a</div> -->
      <!-- <div class="bbb">b</div> -->
      <button @click="handleSaveDay(1)">handleSaveDay測試</button>
      <button @click="test()">測試</button>

      <!-- 沒辦法在畫面顯示 import.meta.env.VITE_BASE_URL 只能用console.log -->
      <!-- <div>env: {{ import.meta.env.VITE_BASE_URL }}</div> -->
    </div>
    <div class="bbb grow w-full">
      <!-- 不可以加() 會導致function的element 是undefined -->
      <input type="file" @change="handleFiles" />
      <div class="overflow-x-auto">
        <table class="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>日期</th>
              <th>早餐金額</th>
              <th>早餐類型</th>
              <th>午餐金額</th>
              <th>午餐類型</th>
              <th>晚餐金額</th>
              <th>晚餐類型</th>
              <th>額外花費</th>
              <th>花費類型</th>
            </tr>
          </thead>
          <tbody v-if="content">
            <tr v-for="(data, index) in content.data">
              <td v-if="index <= lastDayOfMonth">{{ index }}</td>

              <!-- 這邊從:value改成v-model後才能在handleSave中取得修改後的數值 -->
              <!-- 日期 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="costDate[index]" />
              </td>

              <!-- 早餐金額 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="breakfastCost[index]" />
              </td>

              <!-- 早餐類型 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="breakfastType[index]" />
              </td>

              <!-- 午餐金額 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="lunchCost[index]" />
              </td>

              <!-- 午餐類型 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="lunchType[index]" />
              </td>

              <!-- 晚餐金額 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="dinnerCost[index]" />
              </td>

              <!-- 晚餐類型 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="dinnerType[index]" />
              </td>

              <!-- 額外花費 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="extraCost[index]" />
              </td>

              <!-- 花費類型 -->
              <td v-if="index <= lastDayOfMonth">
                <input type="text" v-model="extraType[index]" />
              </td>

              <!-- 儲存這一天 -->
              <td v-if="index <= lastDayOfMonth">
                <button @click="handleSaveDay(index)">儲存這一天</button>
              </td>

              <button v-if="index == lastDayOfMonth + 1" @click="handleSaveMonth">
                儲存這一個月
              </button>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import Papa from "papaparse";
const content = ref(undefined);
const rowSpacing = ref(8); // 每過一個月要增加的行數
const lastDayOfMonth = ref(0);

const costDate = ref([]);
const breakfastCost = ref([]);
const breakfastType = ref([]);
const lunchCost = ref([]);
const lunchType = ref([]);
const dinnerCost = ref([]);
const dinnerType = ref([]);
const extraCost = ref([]);
const extraType = ref([]);

const test = () => {
  // console.log(import.meta.env.BASE_URL); // /_nuxt/
  console.log(import.meta.env.VITE_BASE_URL); // http://localhost:5001
}

const handleFiles = async (element) => {
  console.log(element)
  const file = element.target.files[0];
  const csvText = await file.text(); // 讀成文字
  parseIncomeCsvData(csvText)
};

const handleSaveMonth = () => {
  for (let i = 0; i < lastDayOfMonth.value; i++) {
    // console.log(costDate.value[i]);
    console.log(breakfastType.value[i]);
  }
  console.log("handleSaveMonth");
  // 跳一個月
  rowSpacing.value += 8;
};

const handleSaveDay = async (index) => {
  console.log(`儲存這一天: ${costDate.value[index]}`);
  const response = await useApi().post("/api/v1/report", {
    costDate: costDate.value[index],
    breakfastCost: breakfastCost.value[index],
    breakfastType: breakfastType.value[index],
    lunchCost: lunchCost.value[index],
    lunchType: lunchType.value[index],
    dinnerCost: dinnerCost.value[index],
    dinnerType: dinnerType.value[index],
    extraCost: extraCost.value[index],
    extraType: extraType.value[index],
  });
  console.log(`response: ${JSON.stringify(response)}`);
};

const getLastDayOfMonth = (year, month) => {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
};

const parseIncomeCsvData = (csvText) => {
  Papa.parse(csvText, {
    complete: (results) => {
      content.value = results;

      const month = content.value.data[0 + rowSpacing.value][0];
      const date = new Date(month);

      lastDayOfMonth.value = getLastDayOfMonth(
        date.getFullYear(),
        date.getMonth()
      );

      costDate.value = content.value.data[0 + rowSpacing.value];
      breakfastCost.value = content.value.data[1 + rowSpacing.value];
      breakfastType.value = [];
      lunchCost.value = content.value.data[2 + rowSpacing.value];
      lunchType.value = [];
      dinnerCost.value = content.value.data[3 + rowSpacing.value];
      dinnerType.value = [];
      extraCost.value = content.value.data[4 + rowSpacing.value];
      extraType.value = [];

      console.log(`自動載入完成，這個月最後一天: ${lastDayOfMonth.value}`);
    },
  });
}

onMounted(async () => {
const res = await fetch('/開銷紀錄.csv');
  const csvText = await res.text();
  parseIncomeCsvData(csvText)
});
</script>
