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

      <h2 class="text-xl font-semibold text-gray-800">隔間計算機</h2>
    </div>

    <!-- 設定參數 -->
    <div class="space-y-2">
      <h3 class="text-md font-semibold text-gray-800">計算參數設定</h3>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            最短骨架(台尺):
          </div>
          <el-input type="number" v-model.number="drywallStore.minFrameLengthTaiwanFoot" class="max-w-[40px]" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            骨架間距(cm):
          </div>
          <el-input type="number" v-model.number="drywallStore.frameSpacing" class="max-w-[60px]" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            骨架寬度(cm):
          </div>
          <el-input type="number" v-model.number="drywallStore.frameWidth" class="max-w-[60px]" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            板子厚度(mm):
          </div>
          <el-input type="number" v-model.number="drywallStore.boardThickness" class="max-w-[40px]" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            板子寬度(公分):
          </div>
          <el-input type="number" v-model.number="drywallStore.boardWidthCM" class="max-w-[50px]" />
        </div>

        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            板子高度(公分):
          </div>
          <el-input type="number" v-model.number="drywallStore.boardHeightCM" class="max-w-[50px]" />
        </div>

        <div class="flex items-center col-span-2">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            板子材質:
          </div>
          <el-select v-model="drywallStore.boardMaterial" class="w-full">
            <el-option label="矽酸鈣" value="矽酸鈣" />
            <el-option label="石膏板" value="石膏板" />
          </el-select>
        </div>

        <div class="flex items-center space-x-2">
          <el-checkbox v-model="drywallStore.hasRockWool" label="塞岩棉" />
          <el-checkbox v-model="drywallStore.isDoubleSided" label="雙面" />
        </div>

        <div class="flex items-center space-x-2">
          <el-checkbox v-model="drywallStore.hasDoor" label="有門" />
          <el-checkbox v-model="drywallStore.hasWindow" label="有窗" />
        </div>

        <div v-if="drywallStore.hasDoor" class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            門的高度(公分):
          </div>
          <el-input type="number" v-model.number="drywallStore.doorHeight" class="" />
        </div>

        <div v-if="drywallStore.hasDoor" class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            門的寬度(公分):
          </div>
          <el-input type="number" v-model.number="drywallStore.doorWidth" class="" />
        </div>

        <div v-if="drywallStore.hasWindow" class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            窗戶高度(公分):
          </div>
          <el-input type="number" v-model.number="drywallStore.windowHeight" class="" />
        </div>

        <div v-if="drywallStore.hasWindow" class="flex items-center">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            窗戶寬度(公分):
          </div>
          <el-input type="number" v-model.number="drywallStore.windowWidth" class="" />
        </div>

        <div v-if="drywallStore.hasWindow" class="flex items-center col-span-2">
          <div class="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            距離地面多高(公分):
          </div>
          <el-input type="number" v-model.number="drywallStore.windowHeightFromFloor" class="w-full" />
        </div>
      </div>
    </div>

    <!-- 輸入尺寸 -->
    <div class="flex space-x-2">
      <div class="flex items-center">
        <div class="text-md font-medium text-gray-700 whitespace-nowrap">
          寬:
        </div>
        <el-input type="number" v-model.number="drywallStore.width" class="w-full t" />
      </div>

      <div class="flex items-center">
        <div class="text-md font-medium text-gray-700 whitespace-nowrap">
          高:
        </div>
        <el-input type="number" v-model.number="drywallStore.height" class="w-full t" />
      </div>

      <button class="btn" @click="saveSize">
        儲存
      </button>
    </div>

    <!-- 已儲存的尺寸 -->
    <div>
      <div class="flex justify-between items-center py-2">
        <h2 class="text-lg font-semibold text-gray-800">紀錄的尺寸:</h2>
        <button v-if="drywallStore.savedSizes.length != 0" class="btn" @click="exportToExcel">
          匯出表格
        </button>
      </div>

      <div class="h-[200px] text-[black] overflow-y-scroll border rounded-xl">
        <div v-if="drywallStore.savedSizes.length === 0" class="p-4 text-center text-gray-500">
          尚無記錄
        </div>

        <div v-for="(size, index) in drywallStore.savedSizes" :key="index"
          class="flex justify-between items-center space-x-2 py-2 px-2"
          :class="index < drywallStore.savedSizes.length - 1 ? 'border-b border-gray-100' : ''">
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
        <div v-if="Object.keys(drywallStore.calculatedMaterials).length === 0" class="p-4 text-center text-gray-500">
          尚無材料需求
        </div>

        <!-- 骨架 -->
        <div v-if="drywallStore.calculatedMaterials.frames && drywallStore.calculatedMaterials.frames.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            骨架
          </div>
          <div v-for="frame in drywallStore.calculatedMaterials.frames" :key="frame.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">{{ frame.length }} 尺 (寬 {{ frame.width }}cm)</span>
            <span class="font-medium text-gray-900">數量: {{ frame.quantity }} 支</span>
          </div>
        </div>

        <!-- 上下槽 -->
        <div
          v-if="drywallStore.calculatedMaterials.topBottomTracks && drywallStore.calculatedMaterials.topBottomTracks.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            上下槽
          </div>
          <div v-for="track in drywallStore.calculatedMaterials.topBottomTracks" :key="track.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">8 尺 (寬 {{ track.width }}cm)</span>
            <span class="font-medium text-gray-900">數量: {{ track.quantity }} 支</span>
          </div>
        </div>

        <!-- 加強料 -->
        <div
          v-if="drywallStore.calculatedMaterials.reinforcements && drywallStore.calculatedMaterials.reinforcements.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            加強料
          </div>
          <div v-for="reinforcement in drywallStore.calculatedMaterials.reinforcements" :key="reinforcement.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">8 尺 (寬 {{ reinforcement.width }}cm)</span>
            <span class="font-medium text-gray-900">數量: {{ reinforcement.quantity }} 支</span>
          </div>
        </div>

        <!-- 板子 -->
        <div v-if="drywallStore.calculatedMaterials.boards && drywallStore.calculatedMaterials.boards.length > 0"
          class="border-b border-gray-200">
          <div class="bg-gray-100 px-3 py-2 font-semibold text-gray-800">
            板子
          </div>
          <div v-for="board in drywallStore.calculatedMaterials.boards" :key="board.key"
            class="flex justify-between px-3 py-2 border-b border-gray-50">
            <span class="text-gray-700">
              {{ board.material }} {{ board.thickness }}mm
              ({{ board.widthTF }}尺 × {{ board.heightTF }}尺)
            </span>
            <span class="font-medium text-gray-900">數量: {{ board.quantity }} 片</span>
          </div>
        </div>

        <!-- 岩棉 -->
        <div v-if="drywallStore.calculatedMaterials.rockWool && drywallStore.calculatedMaterials.rockWool > 0"
          class="border-b border-gray-200">
          <div class="flex justify-between bg-gray-100 px-3 py-2">
            <div class="font-semibold text-gray-800">岩棉</div>
            <span class="font-medium text-gray-900 flex items-center">數量:
              {{ drywallStore.calculatedMaterials.rockWool }}
              包
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fa } from 'element-plus/es/locale/index.mjs';

const drywallStore = useDrywallStore()

const saveSize = () => {

  if (drywallStore.hasDoor && drywallStore.doorWidth <= 0) {
    useToastStore().showToast(`請輸入門的寬度`, `error`)
    return;
  }

  if (drywallStore.hasDoor && drywallStore.doorHeight <= 0) {
    useToastStore().showToast(`請輸入門的高度`, `error`)
    return;
  }

  if (drywallStore.hasWindow && drywallStore.windowWidth <= 0) {
    useToastStore().showToast(`請輸入窗戶的寬度`, `error`)
    return;
  }

  if (drywallStore.hasWindow && drywallStore.windowHeight <= 0) {
    useToastStore().showToast(`請輸入窗戶的高度`, `error`)
    return;
  }

  if (drywallStore.width <= 0) {
    useToastStore().showToast(`請輸入寬度`, `error`)
    return;
  }

  if (drywallStore.height <= 0) {
    useToastStore().showToast(`請輸入高度`, `error`)
    return;
  }

  drywallStore.savedSizes.push({
    width: drywallStore.width,
    height: drywallStore.height,
    hasDoor: drywallStore.hasDoor,
    hasWindow: drywallStore.hasWindow,
    doorHeight: drywallStore.doorHeight,
    doorWidth: drywallStore.doorWidth,
    windowHeight: drywallStore.windowHeight,
    windowWidth: drywallStore.windowWidth,
    windowHeightFromFloor: drywallStore.windowHeightFromFloor,
    frameSpacing: drywallStore.frameSpacing,
    frameWidth: drywallStore.frameWidth,
    hasRockWool: drywallStore.hasRockWool,
    isDoubleSided: drywallStore.isDoubleSided,
    boardMaterial: drywallStore.boardMaterial,
    boardThickness: drywallStore.boardThickness,
    boardWidthCM: drywallStore.boardWidthCM,
    boardHeightCM: drywallStore.boardHeightCM,
  });

  drywallStore.width = 0;
  drywallStore.hasDoor = false
  drywallStore.hasWindow = false

  recalculateMaterials();
};

const deleteSize = (index) => {
  drywallStore.savedSizes.splice(index, 1);
  recalculateMaterials();
};

// 計算加強料寬度：如果骨架寬度 > 6.5，使用 6.5，否則使用骨架寬度
const getReinforcementWidth = (frameWidth) => {
  return frameWidth > drywallStore.MAX_REINFORCEMENT_WIDTH ? drywallStore.MAX_REINFORCEMENT_WIDTH : frameWidth;
};

const exportToExcel = () => {
  useDrywallStore().exportToExcel()
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

  drywallStore.savedSizes.forEach(size => {
    const area = size.width * size.height;

    // TODO: 需要計算超過12尺
    // 計算骨架
    const frameCount = Math.ceil(size.width / size.frameSpacing) + 1;
    const frameLength = Math.ceil(size.height / drywallStore.TAIWAN_FOOT_TO_CM);
    const frameLengthClamped = frameLength <= drywallStore.minFrameLengthTaiwanFoot
      ? drywallStore.minFrameLengthTaiwanFoot
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

    // 計算上下槽：每道隔間需要2支
    const trackWidthCm = size.width;
    const trackLengthCm = drywallStore.TRACK_LENGTH_TAIWAN_FOOT * drywallStore.TAIWAN_FOOT_TO_CM;
    // 當有窗戶時 且 不是落地窗時 需要*4
    const tracksNeeded = drywallStore.hasWindow && drywallStore.windowHeightFromFloor != 0 ?
      Math.ceil(trackWidthCm / trackLengthCm) * 4 :
      Math.ceil(trackWidthCm / trackLengthCm) * 2;

    // 檢查該骨架 是否已存在在map裡面
    // 直接使用骨架寬度
    const trackWidth = size.frameWidth;
    if (!topBottomTracksByWidth[trackWidth]) {
      topBottomTracksByWidth[trackWidth] = 0;
    }
    topBottomTracksByWidth[trackWidth] += tracksNeeded;

    // 計算加強料：每個隔間需要 1 支
    const reinforcementWidthCm = size.width;
    const reinforcementLengthCm = drywallStore.REINFORCEMENT_LENGTH_TAIWAN_FOOT * drywallStore.TAIWAN_FOOT_TO_CM;
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

    // console.log(`TAIWAN_FOOT_TO_CM: ${TAIWAN_FOOT_TO_CM}`) // 30.303
    // console.log(`boardArea: ${boardArea}`) // 22038
    // console.log(`area: ${area}`)
    // console.log(`boardCount: ${boardCount}`) // 46

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
    ? Math.ceil(totalRockWoolArea / drywallStore.ROCK_WOOL_PACK_AREA)
    : 0;

  // 整理板子資料
  const boards = Object.keys(boardsByType).map(key => ({
    ...boardsByType[key],
    key,
  }));

  drywallStore.calculatedMaterials = {
    frames,
    topBottomTracks,
    reinforcements,
    rockWool: rockWoolPacks,
    boards,
  };
};
</script>
