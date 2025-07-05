<template>
  <div class="w-full">
    <table class="table table-xs">
      <thead>
        <tr>
          <th>序號</th>
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
      <tbody>
        <!-- 20250511 在csv只有4個row的情況下只會顯示4天 暫時增加csv row數量 -->
        <tr v-for="(data, index) in expenditureList" :key="index">
          <td>{{ index }}</td>

          <!-- 這邊從:value改成v-model後才能在handleSave中取得修改後的數值 -->
          <!-- 日期 -->
          <td>
            <input type="date" v-model="data.costDate.split('T')[0]" />
          </td>

          <!-- 早餐金額 -->
          <td>
            <input type="number" v-model="data.breakfastCost" />
          </td>

          <!-- 早餐類型 -->
          <td>
            <input type="text" v-model="data.breakfastType" />
          </td>

          <!-- 午餐金額 -->
          <td>
            <input type="number" v-model="data.lunchCost" />
          </td>

          <!-- 午餐類型 -->
          <td>
            <input type="text" v-model="data.lunchType" />
          </td>

          <!-- 晚餐金額 -->
          <td>
            <input type="number" v-model="data.dinnerCost" />
          </td>

          <!-- 晚餐類型 -->
          <td>
            <input type="text" v-model="data.dinnerType" />
          </td>

          <!-- 額外花費 -->
          <td>
            <input type="number" v-model="data.extraCost" />
          </td>

          <!-- 花費類型 -->
          <td>
            <input type="text" v-model="data.extraType" />
          </td>

          <!-- 儲存這一天 -->
          <td class="w-auto text-nowrap">
            <button @click="handleSaveDay(index)" class="btn">儲存這一天</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="handleSaveMonth" class="bbb w-auto text-nowrap btn">
      儲存這一個月
    </button>
  </div>
</template>

<script setup>
const expenditureList = ref(undefined)

const handleSaveDay = async (index) => {
  console.log(`儲存這一天: ${index}`);
  // console.log(`早餐: ${expenditureList.value[index].breakfastCost}`);
  console.log(`消費日期: ${expenditureList.value[index].costDate}`);
  // const response = await useApi().post("/api/v1/report", {
  //   costDate: expenditureList.value[index].costDate,
  //   breakfastCost: expenditureList.value[index].breakfastCost,
  //   breakfastType: expenditureList.value[index].breakfastType,
  //   lunchCost: expenditureList.value[index].lunchCost,
  //   lunchType: expenditureList.value[index].lunchType,
  //   dinnerCost: expenditureList.value[index].dinnerCost,
  //   dinnerType: expenditureList.value[index].dinnerType,
  //   extraCost: expenditureList.value[index].extraCost,
  //   extraType: expenditureList.value[index].extraType,
  // });
};

onMounted(async () => {
  const response = await useApi().get("/api/v1/report");
  expenditureList.value = response.data.expenditureReports;
});
</script>