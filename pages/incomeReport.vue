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
              <th>{{ index }}</th>
              <td>{{ content.data[0 + 8][index] }}</td>
              <td>{{ content.data[1 + 8][index] }}</td>
              <input type="text" />
              <td>{{ content.data[2 + 8][index] }}</td>
              <input type="text" />
              <td>{{ content.data[3 + 8][index] }}</td>
              <input type="text" />
              <td>{{ content.data[4 + 8][index] }}</td>
              <input type="text" />
              <td>{{ content.data[6 + 8][index] }}</td>
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

const handleFiles = (element) => {
  Papa.parse(element.target.files[0], {
    complete: function (results) {
      console.log(results);
      content.value = results;
    },
    // header: true, // keyed by field name
  });
};

onMounted(async () => {
  await nextTick();
});
</script>
