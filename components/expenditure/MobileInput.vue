<template>
  <!-- 進入時	從上方 20px 淡入下滑 -->
  <!-- 離開時	向上淡出 -->
  <!-- 持續時間	進入 300ms / 離開 200ms -->
  <!-- 緩動曲線	ease-out (進入) / ease-in (離開) -->
  <!-- Tailwind內建的 -->
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="costStore.showMenu" class="fixed min-h-screen min-w-screen bg-black/50 z-100" @click.stop="closeMenu">
      <!-- 20250707 故意留一個空的@click.stop 避免點擊白色區域後關閉 -->
      <div v-if="costStore.showMenu" @click.stop="" ref="menu"
        class="fixed w-full z-[20] bottom-0 bg-white flex flex-col gap-3 justify-between p-2 text-black rounded-t-[16px]">
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
          <el-date-picker class="flex-1" v-model="expenditure.costDate" value-format="YYYY-MM-DD" type="date"
            placeholder="選擇日期" size="large" />
        </div>
        <div class="flex items-center">
          <!-- 20250707 加上flex-shrink-0防止收縮 為了和日期對齊 -->
          <div class="w-[100px] flex-shrink-0">早餐花費</div>
          <el-input class="" type="number" v-model="expenditure.breakfastCost" placeholder="早餐花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">早餐類型</div>
          <el-input class="" type="text" v-model="expenditure.breakfastType" placeholder="早餐類型" clearable size="large"
            @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">午餐花費</div>
          <el-input class="" type="number" v-model="expenditure.lunchCost" placeholder="午餐花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">午餐類型</div>
          <el-input class="" type="text" v-model="expenditure.lunchType" placeholder="午餐類型" clearable size="large"
            @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">晚餐花費</div>
          <el-input class="" type="number" v-model="expenditure.dinnerCost" placeholder="晚餐花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">晚餐類型</div>
          <el-input class="" type="text" v-model="expenditure.dinnerType" placeholder="晚餐類型" clearable size="large"
            @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">額外花費</div>
          <el-input class="" type="number" v-model="expenditure.extraCost" placeholder="額外花費" min="0" clearable
            size="large" @keyup.enter="handleInputFinish" />
        </div>
        <div class="flex items-center">
          <div class="w-[100px] flex-shrink-0">額外類型</div>
          <el-input class="" type="text" v-model="expenditure.extraType" placeholder="額外類型" clearable size="large"
            @keyup.enter="handleInputFinish" />
        </div>

        <div class="flex w-full gap-5 flex-1">
          <button @click="closeMenu" class="btn btn-soft bg-white border-[#0F2B47] text-[#0F2B47] flex-1">
            取消
          </button>
          <button @click="handleSaveClick" class="btn btn-soft bg-[#0F2B47] flex-1">
            <span v-if="costStore.isLoading" class="loading loading-spinner loading-xs"></span>
            儲存
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const costStore = useCostStore()

const closeMenu = () => {
  costStore.showMenu = false
};

const menu = ref(null)
const expenditure = ref({})

const handleSaveClick = async () => {
  await costStore.handleSaveDay({
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

  // 20251006 在新增支出時即時更新列表
  costStore.expenditureList = []
  costStore.page = 1

  // 需要維持搜尋條件下刷新
  await costStore.searchCosts();
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

// 20250810 避免在沒開啟的狀態下 呼叫getTodayCost 導致呼叫兩次/report
watch(
  () => costStore.showMenu, // props.showMenu,
  async (newVal) => {
    if (newVal) {
      expenditure.value = await costStore.getTodayCost()
    }
  }
)
</script>
