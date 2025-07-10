<template>
  <!-- 進入時	從上方 20px 淡入下滑 -->
  <!-- 離開時	向上淡出 -->
  <!-- 持續時間	進入 300ms / 離開 200ms -->
  <!-- 緩動曲線	ease-out (進入) / ease-in (離開) -->
  <!-- Tailwind內建的 -->
  <!-- <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2"> -->
  <Transition 
    enter-active-class="transition ease-out duration-300" 
    enter-from-class="opacity-0"
    enter-to-class="opacity-100" 
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="props.showMenu && isMobile" class="fixed min-h-screen min-w-screen bg-black/50" @click.stop="closeMenu">
      <!-- 20250707 故意留一個空的@click.stop 避免點擊白色區域後關閉 -->
      <div v-if="props.showMenu && isMobile" @click.stop="" ref="menu"
        class="fixed w-full z-[20] bottom-0 bg-white flex flex-col space-y-3 justify-between p-2 text-black rounded-t-[16px]">
        <div class="w-full flex justify-center">
          <div class="w-[50px] h-[5px] rounded-full bg-[#C8C9C9]" />
        </div>

        <div class="flex justify-between">
          <div class="w-[24px] h-[24px]" />
          <div class="h-[24px] font-[700] text-[18px] w-full flex justify-center items-center">新增花費</div>
          <button @click="closeMenu" class="cursor-pointer w-[24px] h-[24px] flex justify-center items-center">
            <img src="~/assets/icons/close_24_24.svg" alt="">
          </button>
        </div>

        <div class="flex items-center">
          <div class="w-[100px]">日期</div>
          <!-- 20250707 需要加上value-format 取得的數值才會跟預設的input一樣 不然會是2025-07-06T16:00:00.000Z -->
          <el-date-picker class="grow" v-model="expenditure.costDate" value-format="YYYY-MM-DD" type="date"
            placeholder="選擇日期" size="large" />
        </div>
        <div class="flex items-center">
          <!-- 20250707 加上flex-shrink-0防止收縮 為了和日期對齊 -->
          <div class="w-[100px] flex-shrink-0">早餐花費</div>
          <el-input class="grow" type="number" v-model="expenditure.breakfastCost" placeholder="早餐花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">早餐類型</div>
          <el-input class="grow" type="text" v-model="expenditure.breakfastType" placeholder="早餐類型" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">午餐花費</div>
          <el-input class="grow" type="number" v-model="expenditure.lunchCost" placeholder="午餐花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">午餐類型</div>
          <el-input class="grow" type="text" v-model="expenditure.lunchType" placeholder="午餐類型" clearable size="large"
            @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">晚餐花費</div>
          <el-input class="grow" type="number" v-model="expenditure.dinnerCost" placeholder="晚餐花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">晚餐類型</div>
          <el-input class="grow" type="text" v-model="expenditure.dinnerType" placeholder="晚餐類型" clearable size="large"
            @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">額外花費</div>
          <el-input class="grow" type="number" v-model="expenditure.extraCost" placeholder="額外花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">額外類型</div>
          <el-input class="grow" type="text" v-model="expenditure.extraType" placeholder="額外類型" clearable size="large"
            @keyup.enter="handleInputFinish" />
        </div>

        <div class="flex w-full space-x-5">
          <button @click="closeMenu" class="btn btn-soft bg-white border-[#0F2B47] text-[#0F2B47] grow">
            取消
          </button>
          <button @click="handleSaveClick" class="btn btn-soft bg-[#0F2B47] grow">
            <span v-if="useCostStore().isLoading" class="loading loading-spinner loading-xs"></span>
            儲存
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";

const isMobile = computed(() => useWindowSize().width.value <= 640)
const props = defineProps({
  showMenu: Boolean
});

const emit = defineEmits(['update:showMenu']);

const closeMenu = () => {
  emit('update:showMenu', false);
};

const menu = ref(null)
const expenditure = ref({})

const handleSaveClick = () => {
  useCostStore().handleSaveDay({
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
  })
}

const handleInputFinish = (event) => {
  focusNext(event)
  handleSaveClick()
}

const focusNext = (event) => {
  const currentInput = event.target;
  const allInputs = menu.value.querySelectorAll('input');
  const currentIndex = Array.from(allInputs).indexOf(currentInput);

  if (currentIndex < allInputs.length - 1) {
    allInputs[currentIndex + 1].focus()
  }
}

onMounted(async () => {
  expenditure.value = await useCostStore().getTodayCost()
})
</script>