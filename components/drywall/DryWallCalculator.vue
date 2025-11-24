<template>
  <div class="bg-white rounded-2xl p-4 space-y-4">
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F64EB"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="16" x2="20" y2="16" />
        <line x1="9" y1="4" x2="9" y2="8" />
        <line x1="14" y1="8" x2="14" y2="12" />
        <line x1="8" y1="12" x2="8" y2="16" />
        <line x1="16" y1="12" x2="16" y2="16" />
        <line x1="11" y1="16" x2="11" y2="20" />
      </svg>

      <h2 class="text-xl font-semibold text-gray-800">隔間計算機/cm</h2>
    </div>

    <!-- 設定參數 -->
    <div class="space-y-2">
      <h3 class="text-md font-semibold text-gray-800">計算參數設定</h3>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            最短骨架(台尺):
          </div>
          <el-input type="number" v-model.number="minFrameLengthTaiwanFoot" class="w-full" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            骨架間距(cm):
          </div>
          <el-input type="number" v-model.number="frameSpacing" class="w-full" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            骨架寬度(cm):
          </div>
          <el-input type="number" v-model.number="frameWidth" class="w-full" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            板子寬度(公分):
          </div>
          <el-input type="number" v-model.number="boardWidthCM" class="w-full" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            板子高度(公分):
          </div>
          <el-input type="number" v-model.number="boardHeightCM" class="w-full" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            板子厚度(mm):
          </div>
          <el-input type="number" v-model.number="boardThickness" class="w-full" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            板子材質:
          </div>
          <el-select v-model="boardMaterial" class="w-full">
            <el-option label="矽酸鈣" value="矽酸鈣" />
            <el-option label="石膏板" value="石膏板" />
          </el-select>
        </div>

        <div class="flex items-center space-x-2">
          <el-checkbox v-model="hasRockWool" label="塞岩棉" />
          <el-checkbox v-model="isDoubleSided" label="雙面" />
        </div>
      </div>
    </div>

    <!-- 輸入尺寸 -->
    <div class="flex space-x-2">
      <div class="flex items-center">
        <div class="text-md font-medium text-gray-700 whitespace-nowrap">
          寬:
        </div>
        <el-input type="number" v-model.number="width" class="w-full text-lg" />
      </div>

      <div class="flex items-center">
        <div class="text-md font-medium text-gray-700 whitespace-nowrap">
          高:
        </div>
        <el-input type="number" v-model.number="height" class="w-full text-lg" />
      </div>

      <button class="btn" @click="saveSize">
        儲存
      </button>
    </div>

    <!-- 已儲存的尺寸 -->
    <div>
      <div class="flex justify-between items-center py-2">
        <h2 class="text-lg font-semibold text-gray-800">紀錄的尺寸:</h2>
        <!-- <button v-if="savedSizes.length != 0" class="btn" @click="exportToGoogleSheet"> -->
        <button class="btn" @click="exportToGoogleSheet">
          匯出表格
        </button>
      </div>

      <div class="h-[200px] text-[black] overflow-y-scroll border rounded-xl">
        <div v-if="savedSizes.length === 0" class="p-4 text-center text-gray-500">
          尚無記錄
        </div>

        <div v-for="(size, index) in savedSizes" :key="index"
          class="flex justify-between items-center space-x-2 py-2 px-2"
          :class="index < savedSizes.length - 1 ? 'border-b border-gray-100' : ''">
          <div class="flex-1 space-y-1">
            <div class="text-sm font-medium text-gray-700">
              寬: {{ size.width }}cm × 高: {{ size.height }}cm
            </div>
            <div class="text-xs text-gray-500 space-x-2">
              <span>骨架寬: {{ size.frameWidth }}cm</span>
              <span>{{ size.boardMaterial }}</span>
              <span>{{ size.boardThickness }}mm</span>
              <span v-if="size.hasRockWool">塞岩棉</span>
              <span>{{ size.isDoubleSided ? '雙面' : '單面' }}</span>
            </div>
          </div>

          <button class="btn btn-sm" @click="deleteSize(index)">
            <img src="~/assets/icons/delete_24_24_white.svg" class="w-[20px] h-[20px]">
          </button>
        </div>
      </div>
    </div>

    <!-- 需要的材料 -->
    <div>
      <h2 class="text-lg font-semibold text-gray-800">需要的材料:</h2>
      <div class="h-[300px] text-[black] overflow-y-scroll border rounded-xl">
        <div v-if="Object.keys(calculatedMaterials).length === 0" class="p-4 text-center text-gray-500">
          尚無材料需求
        </div>

        <!-- 骨架 -->
        <div v-if="calculatedMaterials.frames && calculatedMaterials.frames.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            骨架
          </div>
          <div v-for="frame in calculatedMaterials.frames" :key="frame.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">{{ frame.length }} 尺 (寬 {{ frame.width }}cm)</span>
            <span class="font-medium text-gray-900">數量: {{ frame.quantity }} 支</span>
          </div>
        </div>

        <!-- 上下槽 -->
        <div v-if="calculatedMaterials.topBottomTracks && calculatedMaterials.topBottomTracks.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            上下槽
          </div>
          <div v-for="track in calculatedMaterials.topBottomTracks" :key="track.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">8 尺 (寬 {{ track.width }}cm)</span>
            <span class="font-medium text-gray-900">數量: {{ track.quantity }} 支</span>
          </div>
        </div>

        <!-- 加強料 -->
        <div v-if="calculatedMaterials.reinforcements && calculatedMaterials.reinforcements.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            加強料
          </div>
          <div v-for="reinforcement in calculatedMaterials.reinforcements" :key="reinforcement.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">8 尺 (寬 {{ reinforcement.width }}cm)</span>
            <span class="font-medium text-gray-900">數量: {{ reinforcement.quantity }} 支</span>
          </div>
        </div>

        <!-- 板子 -->
        <div v-if="calculatedMaterials.boards && calculatedMaterials.boards.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            板子
          </div>
          <div v-for="board in calculatedMaterials.boards" :key="board.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">
              {{ board.material }} {{ board.thickness }}mm
              ({{ board.widthTF }}尺 × {{ board.heightTF }}尺)
            </span>
            <span class="font-medium text-gray-900">數量: {{ board.quantity }} 片</span>
          </div>
        </div>

        <!-- 岩棉 -->
        <div v-if="calculatedMaterials.rockWool && calculatedMaterials.rockWool > 0" class="border-b border-gray-200">
          <div class="flex justify-between bg-gray-100 px-3 py-2">
            <div class="font-semibold text-gray-800">岩棉</div>
            <span class="font-medium text-gray-900 flex items-center">數量: {{ calculatedMaterials.rockWool }}
              包</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const width = ref(0);
const height = ref(0);

// 參數設定
const minFrameLengthTaiwanFoot = ref(8);
const frameSpacing = ref(40.5);
const frameWidth = ref(6.5);
const hasRockWool = ref(false);
const isDoubleSided = ref(false);
const boardMaterial = ref('矽酸鈣');
const boardThickness = ref(9);
const boardWidthCM = ref(122);
const boardHeightCM = ref(183);

const TAIWAN_FOOT_TO_CM = 30.303; // 台尺轉公分
const ROCK_WOOL_SHEET_AREA = 122 * 40.5; // 4941 平方公分
const SHEETS_PER_PACK = 8; // 棉一包8片
const ROCK_WOOL_PACK_AREA = ROCK_WOOL_SHEET_AREA * SHEETS_PER_PACK; // 39528 平方公分
const MAX_REINFORCEMENT_WIDTH = 6.5; // 加強料最大寬度
const TRACK_LENGTH_TAIWAN_FOOT = 8; // 上下槽固定長度 8 台尺
const REINFORCEMENT_LENGTH_TAIWAN_FOOT = 8; // 加強料固定長度 8 台尺

const savedSizes = ref([]);
const calculatedMaterials = ref({});

const saveSize = () => {
  if (width.value <= 0 || height.value <= 0) {
    return;
  }

  savedSizes.value.push({
    width: width.value,
    height: height.value,
    frameSpacing: frameSpacing.value,
    frameWidth: frameWidth.value,
    hasRockWool: hasRockWool.value,
    isDoubleSided: isDoubleSided.value,
    boardMaterial: boardMaterial.value,
    boardThickness: boardThickness.value,
    boardWidthCM: boardWidthCM.value,
    boardHeightCM: boardHeightCM.value,
  });

  width.value = 0;

  recalculateMaterials();
};

const deleteSize = (index) => {
  savedSizes.value.splice(index, 1);
  recalculateMaterials();
};

// 計算加強料寬度：如果骨架寬度 > 6.5，使用 6.5，否則使用骨架寬度
const getReinforcementWidth = (frameWidth) => {
  return frameWidth > MAX_REINFORCEMENT_WIDTH ? MAX_REINFORCEMENT_WIDTH : frameWidth;
};

// 計算上下槽寬度：直接使用骨架寬度
const getTopBottomTrackWidth = (frameWidth) => {
  return frameWidth;
};

const exportToGoogleSheet = () => {
  useDrywallStore().testExportToExcel()
};

const recalculateMaterials = () => {
  // 骨架統計 (依長度和寬度分組)
  const framesByKey = {};

  // 上下槽統計 (依寬度分組)
  const topBottomTracksByWidth = {};

  // 加強料統計 (依寬度分組)
  const reinforcementsByWidth = {};

  // 岩棉總面積
  let totalRockWoolArea = 0;

  // 板子統計 (依材質、厚度、尺寸分組)
  const boardsByType = {};

  savedSizes.value.forEach(size => {
    const area = size.width * size.height;

    // 計算骨架
    const frameCount = Math.ceil(size.width / size.frameSpacing) + 1;
    const frameLength = Math.ceil(size.height / TAIWAN_FOOT_TO_CM);
    const frameLengthClamped = frameLength <= minFrameLengthTaiwanFoot.value
      ? minFrameLengthTaiwanFoot.value
      : frameLength;

    const frameKey = `${frameLengthClamped}_${size.frameWidth}`;
    if (!framesByKey[frameKey]) {
      framesByKey[frameKey] = {
        length: frameLengthClamped,
        width: size.frameWidth,
        quantity: 0,
      };
    }
    framesByKey[frameKey].quantity += frameCount;

    // 計算上下槽：每個隔間需要 2 支 (上和下)
    const trackWidthCm = size.width;
    const trackLengthCm = TRACK_LENGTH_TAIWAN_FOOT * TAIWAN_FOOT_TO_CM;
    const tracksNeeded = Math.ceil(trackWidthCm / trackLengthCm) * 2; // *2 因為上下各一條

    const trackWidth = getTopBottomTrackWidth(size.frameWidth);
    if (!topBottomTracksByWidth[trackWidth]) {
      topBottomTracksByWidth[trackWidth] = 0;
    }
    topBottomTracksByWidth[trackWidth] += tracksNeeded;

    // 計算加強料：每個隔間需要 1 支
    const reinforcementWidthCm = size.width;
    const reinforcementLengthCm = REINFORCEMENT_LENGTH_TAIWAN_FOOT * TAIWAN_FOOT_TO_CM;
    const reinforcementsNeeded = Math.ceil(reinforcementWidthCm / reinforcementLengthCm);

    const reinforcementWidth = getReinforcementWidth(size.frameWidth);
    if (!reinforcementsByWidth[reinforcementWidth]) {
      reinforcementsByWidth[reinforcementWidth] = 0;
    }
    reinforcementsByWidth[reinforcementWidth] += reinforcementsNeeded;

    // 計算岩棉
    if (size.hasRockWool) {
      totalRockWoolArea += area;
    }

    // 計算板子
    const boardArea = size.boardWidthCM * size.boardHeightCM;
    const boardCount = Math.ceil(area / boardArea);
    const finalBoardCount = size.isDoubleSided ? boardCount * 2 : boardCount;

    console.log(`TAIWAN_FOOT_TO_CM: ${TAIWAN_FOOT_TO_CM}`) // 30.303
    console.log(`boardArea: ${boardArea}`) // 22038
    console.log(`area: ${area}`)
    console.log(`boardCount: ${boardCount}`) // 46

    const boardKey = `${size.boardMaterial}_${size.boardThickness}_${size.boardWidthCM}_${size.boardHeightCM}`;

    if (!boardsByType[boardKey]) {
      boardsByType[boardKey] = {
        material: size.boardMaterial,
        thickness: size.boardThickness,
        widthTF: size.boardWidthCM,
        heightTF: size.boardHeightCM,
        quantity: 0,
      };
    }
    boardsByType[boardKey].quantity += finalBoardCount;
  });

  // 整理骨架資料
  const frames = Object.keys(framesByKey)
    .map(key => ({
      ...framesByKey[key],
      key,
    }))
    .sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.width - b.width;
    });

  // 整理上下槽資料
  const topBottomTracks = Object.keys(topBottomTracksByWidth)
    .map(width => ({
      width: Number(width),
      quantity: topBottomTracksByWidth[width],
      key: `track_${width}`,
    }))
    .sort((a, b) => a.width - b.width);

  // 整理加強料資料
  const reinforcements = Object.keys(reinforcementsByWidth)
    .map(width => ({
      width: Number(width),
      quantity: reinforcementsByWidth[width],
      key: `reinforcement_${width}`,
    }))
    .sort((a, b) => a.width - b.width);

  // 計算岩棉包數
  const rockWoolPacks = totalRockWoolArea > 0
    ? Math.ceil(totalRockWoolArea / ROCK_WOOL_PACK_AREA)
    : 0;

  // 整理板子資料
  const boards = Object.keys(boardsByType).map(key => ({
    ...boardsByType[key],
    key,
  }));

  calculatedMaterials.value = {
    frames,
    topBottomTracks,
    reinforcements,
    rockWool: rockWoolPacks,
    boards,
  };
};
</script>
