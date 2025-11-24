import { defineStore } from "pinia"
import * as XLSX from "xlsx"

export const useDrywallStore = defineStore("drywall", () => {
  // ... 你原有的所有 ref 變數 ...

  const width = ref(0)
  const height = ref(0)
  const hasDoor = ref(false)
  const hasWindow = ref(false)
  const doorHeight = ref(0)
  const doorWidth = ref(0)
  const windowHeight = ref(0)
  const windowWidth = ref(0)
  const windowHeightFromFloor = ref(0)

  // 參數設定
  const minFrameLengthTaiwanFoot = ref(8)
  const maxFrameLengthTaiwanFoot = ref(12)
  const frameSpacing = ref(40.5)
  const frameWidth = ref(6.5)
  const hasRockWool = ref(false)
  const isDoubleSided = ref(false)
  const boardMaterial = ref("矽酸鈣")
  const boardThickness = ref(9)
  const boardWidthCM = ref(122)
  const boardHeightCM = ref(183)

  const TAIWAN_FOOT_TO_CM = 30.303
  const ROCK_WOOL_SHEET_AREA = 122 * 40.5
  const SHEETS_PER_PACK = 8
  const ROCK_WOOL_PACK_AREA = ROCK_WOOL_SHEET_AREA * SHEETS_PER_PACK
  const MAX_REINFORCEMENT_WIDTH = 6.5
  const TRACK_LENGTH_TAIWAN_FOOT = 8
  const REINFORCEMENT_LENGTH_TAIWAN_FOOT = 8

  const savedSizes = ref([])
  const calculatedMaterials = ref({})

  const testExportToExcel = () => {
    const workbook = XLSX.utils.book_new()
    const worksheetData = [
      [""],
      [""],
      [
        "隔間編號",
        "長",
        "高",
        "面積",
        "門編號",
        "長",
        "高",
        "面積",
        "窗編號",
        "長",
        "高",
        "面積",
        "小計",
        "上下槽",
        "加強料",
        "橫柱",
        "60K棉",
        "板子",
        "12尺",
        "11尺",
        "10尺",
        "9尺",
        "8尺",
        "槽鐵",
      ],
      ["", 100], // B4 = width.value (第4行,第2列)
    ]
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, "分頁一")
    const date = new Date()
    const fileName = `隔間計算機_${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(
      2,
      "0",
    )}${String(date.getMinutes()).padStart(2, "0")}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  // 匯出 Excel 功能
  const exportToExcel = () => {
    // 創建一個新的工作簿
    const workbook = XLSX.utils.book_new()

    // 創建工作表數據
    const worksheetData = [
      ["乾式隔間9.2公分骨架+9mm水泥板+60K岩棉"],
      [""],
      [
        "門窗編號",
        "長",
        "高",
        "面積",
        "編號",
        "長",
        "高",
        "面積",
        "編號",
        "長",
        "高",
        "面積",
        "小計",
        "上下槽",
        "七字收邊",
        "骨架",
        "百葉",
        "加強",
        "橫柱",
        "60K棉",
        "9mm水泥板",
        "12尺",
        "10尺",
        "9尺",
        "8尺",
        "曹鐵",
      ],
      [
        "2F1裡面下方窗戶",
        width.value,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      // 更多資料行...
    ]

    // 將數據轉換為工作表
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // 設定欄寬 (可選)
    worksheet["!cols"] = [
      { wch: 20 }, // A 欄
      { wch: 10 }, // B 欄
      { wch: 10 }, // C 欄
      { wch: 10 }, // D 欄
      // ... 更多欄位
    ]

    // 將工作表加入工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, "隔間計算")

    // 生成檔案名稱 (包含日期時間)
    const date = new Date()
    const fileName = `乾式隔間計算_${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(
      2,
      "0",
    )}${String(date.getMinutes()).padStart(2, "0")}.xlsx`

    // 匯出檔案
    XLSX.writeFile(workbook, fileName)
  }

  return { testExportToExcel, exportToExcel }
})
