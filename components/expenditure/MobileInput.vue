<template>
  <div class="relative h-screen w-screen">
    <div ref="menu" class="fixed bbb w-full h-1/3 z-20 bottom-0 bg-[#1D232A] flex flex-col justify-between p-2">
      <div class="flex">
        <div class="w-[100px]">日期</div>
        {{ costDate }}
        <input type="date" class="bbb w-full" v-model="expenditure.costDate" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">早餐花費</div>
        <input type="number" min="0" class="bbb w-full" v-model="expenditure.breakfastCost" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">早餐類型</div>
        <input type="text" class="bbb w-full" v-model="expenditure.breakfastType" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">午餐花費</div>
        <input type="number" min="0" class="bbb w-full" v-model="expenditure.lunchCost" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">午餐類型</div>
        <input type="text" class="bbb w-full" v-model="expenditure.lunchType" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">晚餐花費</div>
        <input type="number" min="0" class="bbb w-full" v-model="expenditure.dinnerCost" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">晚餐類型</div>
        <input type="text" class="bbb w-full" v-model="expenditure.dinnerType" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">額外花費</div>
        <input type="number" min="0" class="bbb w-full" v-model="expenditure.extraCost" @keyup.enter="handleInputFinish" />
      </div>

      <div class="flex">
        <div class="w-[100px]">額外類型</div>
        <input type="text" class="bbb w-full" v-model="expenditure.extraType" @keyup.enter="handleInputFinish" />
      </div>
    </div>
  </div>
</template>

<script setup>
const menu = ref(null)
const expenditure = ref({})

const handleSaveDay = async () => {
  // console.log(`早餐: ${expenditure.value[index].breakfastCost}`);
  console.log(`消費日期: ${expenditure.value.costDate}`);
  const response = await useApi().post("/api/v1/report", {
    costDate: expenditure.value.costDate,
    // toString是必要的 為了填入min 不轉型Go會Error
    breakfastCost: expenditure.value.breakfastCost.toString(),
    breakfastType: expenditure.value.breakfastType,
    lunchCost: expenditure.value.lunchCost.toString(),
    lunchType: expenditure.value.lunchType,
    dinnerCost: expenditure.value.dinnerCost.toString(),
    dinnerType: expenditure.value.dinnerType,
    extraCost: expenditure.value.extraCost.toString(),
    extraType: expenditure.value.extraType,
  });
};

const handleInputFinish = (event) => {
  focusNext(event)
  handleSaveDay()
}

const focusNext = (event) => {
  console.log(`focusNext`)
  const currentInput = event.target;
  const allInputs = menu.value.querySelectorAll('input');
  console.log(`allInputs.length: ${allInputs.length}`)
  const currentIndex = Array.from(allInputs).indexOf(currentInput);
  console.log(`currentIndex: ${currentIndex}`)

  if (currentIndex < allInputs.length - 1) {
    allInputs[currentIndex + 1].focus()
  }
}

onMounted(() => {
  expenditure.value.costDate = new Date().toISOString().split('T')[0]
  expenditure.value.breakfastCost = 0
  expenditure.value.lunchCost = 0
  expenditure.value.dinnerCost = 0
  expenditure.value.extraCost = 0
})
</script>