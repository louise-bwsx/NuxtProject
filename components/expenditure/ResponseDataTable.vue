<template>
  <div class="w-full grow overflow-y-auto">
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
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- 20250511 在csv只有4個row的情況下只會顯示4天 暫時增加csv row數量 -->
        <tr v-for="(data, index) in expenditureList" :key="index" class="w-[100px]">
          <td class="!py-[0px] ">{{ index }}</td>
          <td class="!py-[0px] "><input class="w-[90px]" type="date" v-model="data.costDate.split('T')[0]" /></td>
          <td class="!py-[0px] "><input class="w-full" type="number" v-model="data.breakfastCost" /></td>
          <td class="!py-[0px] "><input class="w-[100px]" type="text" v-model="data.breakfastType" /></td>
          <td class="!py-[0px] "><input class="w-full" type="number" v-model="data.lunchCost" /></td>
          <td class="!py-[0px] "><input class="w-[100px]" type="text" v-model="data.lunchType" /></td>
          <td class="!py-[0px] "><input class="w-full" type="number" v-model="data.dinnerCost" /></td>
          <td class="!py-[0px] "><input class="w-[100px]" type="text" v-model="data.dinnerType" /></td>
          <td class="!py-[0px] "><input class="w-full" type="number" v-model="data.extraCost" /></td>
          <td class="!py-[0px] "><input class="w-[100px]" type="text" v-model="data.extraType" /></td>
          <td class="!py-[0px] w-auto text-nowrap"><button @click="handleSaveDay(index)" class="btn">儲存這一天</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const expenditureList = ref(undefined)

const handleSaveDay = async (index) => {
  await useCostStore().handleSaveDay({
    costDate: expenditureList.value[index].costDate,
    breakfastCost: expenditureList.value[index].breakfastCost.toString(),
    breakfastType: expenditureList.value[index].breakfastType,
    lunchCost: expenditureList.value[index].lunchCost.toString(),
    lunchType: expenditureList.value[index].lunchType,
    dinnerCost: expenditureList.value[index].dinnerCost.toString(),
    dinnerType: expenditureList.value[index].dinnerType,
    extraCost: expenditureList.value[index].extraCost.toString(),
    extraType: expenditureList.value[index].extraType,
  })
};

onMounted(async () => {
  const response = await useApiStore().get("/api/v1/report");
  expenditureList.value = response.data.expenditureReports;
});
</script>