<template>
  <!-- 20250511 在csv只有4個row的情況下只會顯示4天 暫時增加csv row數量 -->
  <tr v-for="(data, index) in costStore.expenditureList" :key="index">
    <td class="!py-[0px]">{{ index }}</td>
    <td class="!py-[0px]"><input class="w-[90px]" type="date" v-model="data.costDate.split('T')[0]" /></td>
    <td class="!py-[0px]"><input class="w-[50px]" type="number" v-model="data.breakfastCost" /></td>
    <td class="!py-[0px]"><input class="flex-1" type="text" v-model="data.breakfastType" /></td>
    <td class="!py-[0px]"><input class="w-[50px]" type="number" v-model="data.lunchCost" /></td>
    <td class="!py-[0px]"><input class="flex-1" type="text" v-model="data.lunchType" /></td>
    <td class="!py-[0px]"><input class="w-[50px]" type="number" v-model="data.dinnerCost" /></td>
    <td class="!py-[0px]"><input class="flex-1" type="text" v-model="data.dinnerType" /></td>
    <td class="!py-[0px]"><input class="w-[50px]" type="number" v-model="data.extraCost" /></td>
    <td class="!py-[0px]"><input class="flex-1" type="text" v-model="data.extraType" /></td>
    <td class="!py-[0px] text-nowrap flex justify-center"><button @click="handleSaveDay(index)"
        class="btn">儲存這一天</button></td>
  </tr>
</template>

<script setup>
const costStore = useCostStore()

const handleSaveDay = async (index) => {
  await costStore.handleSaveDay({
    costDate: costStore.expenditureList[index].costDate,
    breakfastCost: costStore.expenditureList[index].breakfastCost.toString(),
    breakfastType: costStore.expenditureList[index].breakfastType,
    lunchCost: costStore.expenditureList[index].lunchCost.toString(),
    lunchType: costStore.expenditureList[index].lunchType,
    dinnerCost: costStore.expenditureList[index].dinnerCost.toString(),
    dinnerType: costStore.expenditureList[index].dinnerType,
    extraCost: costStore.expenditureList[index].extraCost.toString(),
    extraType: costStore.expenditureList[index].extraType,
  })
};
</script>