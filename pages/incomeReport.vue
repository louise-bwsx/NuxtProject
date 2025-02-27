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
      c

      <input type="file" @change="handleFiles" />
    </div>
  </div>
</template>

<script setup>
import Papa from "papaparse";
const content = undefined;

const handleFiles = (element) => {
  Papa.parse(element.target.files[0], {
    complete: function (results) {
      console.log(results);
    },
    header: true, // keyed by field name
  });
};

const handleConvert = (csvString) => {
  var results = Papa.parse(csvString, config);
  console.log(results);
};

const getProduct = async (id) => {
  const { data, pending, error } = await useFetch(
    `https://fakestoreapi.com/products/${id}`
  );

  console.log("after this" + id);
  console.log(data.value);
};

onMounted(async () => {
  await nextTick();
  await getProduct(2);
});
</script>
