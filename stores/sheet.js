import { defineStore } from 'pinia'
import Papa from "papaparse";

export const useSheetStore = defineStore('sheet', () => {
  const sheet = ref([]);
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1toMShsJED2XOhtQ4ilyQdaoXDIUwvvg1B7CVBLgZiOM/gviz/tq?tqx=out:csv&sheet=工作表1'
  // 避免沒有重新抓sheet 導致重複覆蓋lastRowIndex
  const cacheIndex = ref(0);
  
  

  // 取得標頭 "key", "zh", "en", "ja"
  const getColumnHead = computed(() => {
    return sheet.value[0].filter((c) => c.trim().length > 0);
  })

  const getLastRowIndex = () => {
    // 如果在最後一行新增 "  " 不會增加 但如果是 "  a"就會增加 就算事後刪掉a 保留"  "也還是新增後的length
    // 如果有跳行 也會是新增後的length

    const result = sheet.value.length + cacheIndex.value;
    console.log(`getLastRowIndex: ${result}`);
    return result;
  };

  // "A" "B" "C"
  const getColumnTop = (index) => {
    const result = String.fromCharCode(97 + index).toUpperCase();
    console.log(result)
    // 97是'a'
    return result
  };

  const hasSameKey = (key) => {
    const result = sheet.value.some((s) => s[0] === key);
    return result;
  };

  const fetchSheet = () => {
    console.log(`fetchSheet`);    
    // Papa.parse(sheetUrl, {
    //   download: true,
    //   // skipEmptyLines: true, // 加上後還是會顯示 ""
    //   // header: true, // 使用header在取得對應語言會比較麻煩
    //   complete: (results) => {
    //     sheet.value = results.data;
    //     // console.log('✅ 解析成功:', results.data)
    //   },
    //   error: (err) => {
    //     console.error("❌ 發生錯誤:", err);
    //   },
    // });

    // 雖然方法本身沒有async 但是使用時可以await 也確實能得到await過後的資料
    return new Promise(function (resolve) {
      Papa.parse(sheetUrl, {
        download: true,
        // skipEmptyLines: true, // 加上後還是會顯示 ""
        // header: true, // 使用header在取得對應語言會比較麻煩
        complete: (results) => {
          sheet.value = results.data;
          // console.log('✅ 解析成功:', results.data)
          resolve(results.data); // 在這裡調用 resolve
        },
        error: (err) => {
          console.error("❌ 發生錯誤:", err);
          reject(err); // 也要處理錯誤情況
        },
      });
    })
  }

  return {
    sheet,
    fetchSheet,
    hasSameKey,
    getLastRowIndex,
    getColumnHead,
    getColumnTop,
    cacheIndex,
  };
})
