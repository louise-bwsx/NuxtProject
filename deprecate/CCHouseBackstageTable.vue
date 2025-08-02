<template>
  <!-- head內容太多塞在一起會換行 -->
  <!-- 固定不換行會互相覆蓋 很難閱讀 -->
  <!-- 目前不知道怎麼不覆蓋 並且水平捲動時連動 但垂直捲動紙捲tbody -->
  <div class="border border-[#e9e9e9] overflow-hidden h-full flex flex-col">
    <!-- sticky thead -->
    <div class="shrink-1">
      <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#f5f5f5] text-[#171A1F] text-[14px]">
          <tr>
            <th class="p-[4px] w-[10%]">序號</th>
            <th class="p-[4px] w-[10%]">日期</th>
            <th class="p-[4px] w-[10%]">早餐金額</th>
            <th class="p-[4px] w-[10%]">早餐類型</th>
            <th class="p-[4px] w-[10%]">午餐金額</th>
            <th class="p-[4px] w-[10%]">午餐類型</th>
            <th class="p-[4px] w-[10%]">晚餐金額</th>
            <th class="p-[4px] w-[10%]">晚餐類型</th>
            <th class="p-[4px] w-[10%]">額外花費</th>
            <th class="p-[4px] w-[10%]">額外類型</th>
            <th class="p-[4px] w-[10%]">操作</th>
          </tr>
        </thead>
      </table>
    </div>
    <!-- scrollable tbody -->
    <div class="overflow-x-none overflow-y-auto flex-1">
      <table class="w-full table-fixed text-left border-collapse">
        <tbody class=" text-[14px]">
          <tr v-for="(data, index) in expenditureList" :key="index" class="border-t border-[#e9e9e9] flex items-center">
            <td class="p-[4px] w-[10%]">{{ index }}</td>
            <td class="p-[4px] w-[10%]"><input type="date" v-model="data.costDate.split('T')[0]" /></td>
            <td class="p-[4px] w-[10%]"><input type="number" v-model="data.breakfastCost" /></td>
            <td class="p-[4px] w-[10%]"><input type="text" v-model="data.breakfastType" /></td>
            <td class="p-[4px] w-[10%]"><input type="number" v-model="data.lunchCost" /></td>
            <td class="p-[4px] w-[10%]"><input type="text" v-model="data.lunchType" /></td>
            <td class="p-[4px] w-[10%]"><input type="number" v-model="data.dinnerCost" /></td>
            <td class="p-[4px] w-[10%]"><input type="text" v-model="data.dinnerType" /></td>
            <td class="p-[4px] w-[10%]"><input type="number" v-model="data.extraCost" /></td>
            <td class="p-[4px] w-[10%]"><input type="text" v-model="data.extraType" /></td>
            <td class="p-[4px] w-[10%]">
              <button @click=" handleSaveDay(index)" class="font-[400] text-[14px] text-[#50B847]">
                儲存
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>