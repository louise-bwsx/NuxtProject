<template>
  <!-- 已經用不到了 -->
  <div class="w-full">
    <!-- 不可以加() 會導致function的element 是undefined -->
    <input type="file" @change="handleFiles" />
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
        <tr v-for="(date, index) in costDate" :key="index">
          <td v-if="index < lastDayOfMonth">{{ index }}</td>

          <!-- 這邊從:value改成v-model後才能在handleSave中取得修改後的數值 -->
          <!-- 日期 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="costDate[index]" />
          </td>

          <!-- 早餐金額 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="breakfastCost[index]" />
          </td>

          <!-- 早餐類型 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="breakfastType[index]" />
          </td>

          <!-- 午餐金額 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="lunchCost[index]" />
          </td>

          <!-- 午餐類型 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="lunchType[index]" />
          </td>

          <!-- 晚餐金額 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="dinnerCost[index]" />
          </td>

          <!-- 晚餐類型 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="dinnerType[index]" />
          </td>

          <!-- 額外花費 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="extraCost[index]" />
          </td>

          <!-- 花費類型 -->
          <td v-if="index < lastDayOfMonth">
            <input type="text" v-model="extraType[index]" />
          </td>

          <!-- 儲存這一天 -->
          <td v-if="index < lastDayOfMonth" class="w-auto text-nowrap">
            <button @click="handleSaveDay(index)" class="btn">儲存這一天</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="handleSaveMonth" class=" w-auto text-nowrap btn">
      儲存這一個月
    </button>
  </div>
</template>

<script setup>
import Papa from "papaparse";

const rowSpacing = ref(8); // 每過一個月要增加的行數
const pastMonth = ref(0); // 經過的月份 從一開始 每次按下儲存這一個月後 += rowSpacing
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
const csvContent = ref([])

const props = defineProps({
  csvText: String
});

const handleSaveMonth = async () => {
  // console.log("handleSaveMonth");
  for (let i = 0; i < lastDayOfMonth.value; i++) {
    await handleSaveDay(i)
    await delaySecends(0.25)
  }
  // TODOWarning: 目前跳下一個月是壞的
  // 跳一個月
  pastMonth.value += rowSpacing.value;

  const month = csvContent.value.data[0 + pastMonth.value][0];
  const date = new Date(month);
  setLastDayOfMonth(date);
  loadCostDataForDay(pastMonth.value);
  setExtraType()
};

const delaySecends = (secends) => {
  return new Promise(resolve => {
    setTimeout(resolve, secends * 1000);
  });
}

const handleSaveDay = async (index) => {
  // console.log(`儲存這一天: ${costDate.value[index]}`);
  const response = await useApiStore().post("/api/v1/report", {
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

  if (response.code == 0) {
    useToastStore().showToast("儲存成功", "success")
  }
};

const getLastDayOfMonth = (year, month) => {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
};

const parseExpenditureCsvData = (csvText) => {
  Papa.parse(csvText, {
    complete: (results) => {
      csvContent.value = results;

      const month = csvContent.value.data[0 + pastMonth.value][0];
      const date = new Date(month);

      setLastDayOfMonth(date);

      loadCostDataForDay(pastMonth.value);
      setExtraType()

      // console.log(`自動載入完成，這個月最後一天: ${lastDayOfMonth.value}`);
    },
  });
}

const setExtraType = () => {
  for (let i = 0; i < lastDayOfMonth.value; i++) {
    if (breakfastCost.value[i]) {
      var breakfast = breakfastCost.value[i].match(/^(\d+)(.*)$/)
      breakfastCost.value[i] = breakfast[1]
      breakfastType.value[i] = breakfast[2]
    }

    if (lunchCost.value[i]) {
      var lunch = lunchCost.value[i].match(/^(\d+)(.*)$/)
      lunchCost.value[i] = lunch[1]
      lunchType.value[i] = lunch[2]
    }

    if (dinnerCost.value[i]) {
      var dinner = dinnerCost.value[i].match(/^(\d+)(.*)$/)
      dinnerCost.value[i] = dinner[1]
      dinnerType.value[i] = dinner[2]
    }

    if (extraCost.value[i]) {
      var extra = extraCost.value[i].match(/^(\d+)(.*)$/) // 數字和中文分離
      // console.log(extra[0]) // 分離前
      extraCost.value[i] = extra[1] // 分離後第一個
      extraType.value[i] = extra[2] // 分離前第二個
    }
  }
}

const setLastDayOfMonth = (date) => {
  lastDayOfMonth.value = getLastDayOfMonth(
    date.getFullYear(),
    date.getMonth()
  );
}

const loadCostDataForDay = (offset) => {
  costDate.value = csvContent.value.data[0 + offset];
  breakfastCost.value = csvContent.value.data[1 + offset];
  breakfastType.value = [];
  lunchCost.value = csvContent.value.data[2 + offset];
  lunchType.value = [];
  dinnerCost.value = csvContent.value.data[3 + offset];
  dinnerType.value = [];
  extraCost.value = csvContent.value.data[4 + offset];
  extraType.value = [];
};

const handleFiles = async (element) => {
  const file = element.target.files[0];
  csvText.value = await file.text(); // 讀成文字
};

onMounted(() => {
  // 讀取csv的做法
  // const res = await fetch('/開銷紀錄.csv');
  // const csvText = await res.text();
  parseExpenditureCsvData(props.csvText)
})
</script>