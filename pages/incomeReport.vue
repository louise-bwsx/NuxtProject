<template>
  <!-- IncomeReport -->
  <div
    class="bbb min-h-screen overflow-hidden overflow-y-hidden flex flex-col justify-center items-center"
  >
    <div class="bbb flex flex-row grow w-full">
      <!-- <div class="bbb">a</div> -->
      <!-- <div class="bbb">b</div> -->
    </div>
    <div class="bbb grow w-full">
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
              <th v-if="index <= lastDayOfMonth">{{ index }}</th>

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

              <button v-if="index == lastDayOfMonth + 1" @click="handleSave">
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
const dayIndex = ref(0);
const monthIndex = ref(0);
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

const handleFiles = (element) => {
  Papa.parse(element.target.files[0], {
    complete: function (results) {
      // console.log(`results: ${JSON.stringify(results)}`);
      content.value = results;

      var month = content.value.data[0 + rowSpacing.value][0];
      var date = new Date(month);

      // console.log(date); // Wed Feb 19 2025 00:00:00 GMT+0800 (台北標準時間)
      // console.log(`date.getDate(): ${date.getDate()}`); // date.getDate(): 19

      lastDayOfMonth.value = getLastDayOfMonth(
        date.getFullYear(),
        date.getMonth()
      );

      costDate.value = content.value.data[0 + rowSpacing.value];
      breakfastCost.value = content.value.data[1 + rowSpacing.value];
      breakfastType.value = Array(lastDayOfMonth.value).fill("1");
      lunchCost.value = content.value.data[2 + rowSpacing.value];
      lunchType.value = [];
      dinnerCost.value = content.value.data[3 + rowSpacing.value];
      dinnerType.value = [];
      extraCost.value = content.value.data[4 + rowSpacing.value];
      extraType.value = [];
      console.log(`這個月最後一天: ${lastDayOfMonth.value}`);
    },
  });
};

const handleSave = () => {
  for (let i = 0; i < lastDayOfMonth.value; i++) {
    // console.log(costDate.value[i]);
    console.log(breakfastType.value[i]);
  }
  console.log("handleSave");
  // 跳一個月
  rowSpacing.value += 8;
};

const getLastDayOfMonth = (year, month) => {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
};

onMounted(async () => {
  // await nextTick();
});
</script>
