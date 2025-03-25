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
              <th>當天總花費</th>
            </tr>
          </thead>
          <tbody v-if="content">
            <tr v-for="(data, index) in content.data">
              <th v-if="index <= lastDayOfMonth">{{ index }}</th>
              <td v-if="index <= lastDayOfMonth">
                {{ content.data[0 + rowSpacing][index] }}
              </td>
              <td v-if="index <= lastDayOfMonth">
                {{ content.data[1 + rowSpacing][index] }}
              </td>
              <input v-if="index <= lastDayOfMonth" type="text" />
              <td v-if="index <= lastDayOfMonth">
                {{ content.data[2 + rowSpacing][index] }}
              </td>
              <input v-if="index <= lastDayOfMonth" type="text" value="aaa" />
              <td v-if="index <= lastDayOfMonth">
                {{ content.data[3 + rowSpacing][index] }}
              </td>
              <input v-if="index <= lastDayOfMonth" type="text" />
              <td v-if="index <= lastDayOfMonth">
                {{ content.data[4 + rowSpacing][index] }}
              </td>
              <input v-if="index <= lastDayOfMonth" type="text" />
              <td v-if="index <= lastDayOfMonth">
                {{ content.data[6 + rowSpacing][index] }}
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
const rowSpacing = ref(8);
const lastDayOfMonth = ref(0);

const handleFiles = (element) => {
  Papa.parse(element.target.files[0], {
    complete: function (results) {
      console.log(results);
      content.value = results;

      var month = content.value.data[0 + rowSpacing.value][0];
      var date = new Date(month);

      // console.log(date); // Wed Feb 19 2025 00:00:00 GMT+0800 (台北標準時間)
      // console.log(`date.getDate(): ${date.getDate()}`); // date.getDate(): 19

      lastDayOfMonth.value = getLastDayOfMonth(
        date.getFullYear(),
        date.getMonth()
      );
      console.log(lastDayOfMonth.value);
    },
    // header: true, // keyed by field name
  });
};

const handleSave = () => {
  console.log("handleSave");
  // 跳一個月
  rowSpacing.value += 8;
  var month = content.data[0 + rowSpacing][1];
  var date = new Date(month);
  console.log(date);
  // var getLastDayOfMonth = new Date(month);
};

const getLastDayOfMonth = (year, month) => {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
};

onMounted(async () => {
  // await nextTick();
});
</script>
