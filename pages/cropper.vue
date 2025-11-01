<template>
  <div class="p-4">
    <h1>
      使用 Cropper.js 實作的圖片裁切小工具
    </h1>

    <!-- 圖片上傳區域 -->
    <input ref="fileInputRef" type="file" @change="handleFileChange" class="hidden" accept="image/*" />

    <!-- 裁剪容器 - 使用 ClientOnly 避免 SSR 問題 -->
    <ClientOnly>
      <div v-if="imageUrl" class="my-4 overflow-auto border-2 border-gray-300" style="max-height: 80vh;">
        <cropper-canvas ref="canvasRef" background class="w-full" style="display: block;" @wheel="handleWheel">
          <cropper-image ref="imageRef" :src="imageUrl" alt="Picture" rotatable scalable skewable translatable />
          <cropper-selection ref="selectionRef" initial-coverage="0.8" movable resizable keyboard>
            <cropper-grid role="grid" covered />
            <cropper-crosshair centered />
            <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
            <cropper-handle action="n-resize" />
            <cropper-handle action="e-resize" />
            <cropper-handle action="s-resize" />
            <cropper-handle action="w-resize" />
            <cropper-handle action="ne-resize" />
            <cropper-handle action="nw-resize" />
            <cropper-handle action="se-resize" />
            <cropper-handle action="sw-resize" />
          </cropper-selection>
        </cropper-canvas>
      </div>
    </ClientOnly>

    <!-- 操作按鈕 -->
    <div class="flex space-x-4 mt-4">
      <button @click="fileInputRef?.click()" class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
        上傳圖片
      </button>

      <button @click="cropImage" :disabled="!imageUrl"
        class="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400">
        裁剪圖片
      </button>

      <button @click="resetCropper" :disabled="!imageUrl"
        class="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400">
        重置
      </button>
    </div>

    <!-- 裁剪後的圖片預覽 -->
    <div class="mt-8" v-if="croppedImage">
      <h2 class="text-xl font-bold mb-2">裁剪結果</h2>
      <img :src="croppedImage" alt="Cropped Image" class="max-w-full border" />
      <p class="mt-2 text-sm text-gray-600">尺寸: {{ croppedSize }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// 狀態管理
const canvasRef = ref(null);
const selectionRef = ref(null);
const fileInputRef = ref(null);
const imageUrl = ref(null);
const croppedImage = ref(null);
const croppedSize = ref('');

// 在客戶端掛載時註冊 Web Components
onMounted(async () => {
  if (process.client) {
    try {
      // 動態導入並註冊 Cropper 的 Web Components
      await Promise.all([
        import('@cropper/element-canvas').then(m => {
          if (!customElements.get('cropper-canvas')) {
            customElements.define('cropper-canvas', m.default);
          }
        }),
        import('@cropper/element-image').then(m => {
          if (!customElements.get('cropper-image')) {
            customElements.define('cropper-image', m.default);
          }
        }),
        import('@cropper/element-handle').then(m => {
          if (!customElements.get('cropper-handle')) {
            customElements.define('cropper-handle', m.default);
          }
        }),
        import('@cropper/element-selection').then(m => {
          if (!customElements.get('cropper-selection')) {
            customElements.define('cropper-selection', m.default);
          }
        }),
        import('@cropper/element-grid').then(m => {
          if (!customElements.get('cropper-grid')) {
            customElements.define('cropper-grid', m.default);
          }
        }),
        import('@cropper/element-crosshair').then(m => {
          if (!customElements.get('cropper-crosshair')) {
            customElements.define('cropper-crosshair', m.default);
          }
        })
      ]);

      console.log('Cropper Web Components 註冊完成');
    } catch (error) {
      console.error('載入 Cropper 元件失敗:', error);
    }
  }
});

// 處理檔案變更
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target.result;
    croppedImage.value = null;
    croppedSize.value = '';
  };
  reader.readAsDataURL(file);
};

// 裁剪圖片
const cropImage = async () => {
  if (!selectionRef.value || !imageUrl.value) {
    console.error('selectionRef 或 imageUrl 不存在');
    return;
  }

  await nextTick();

  try {
    // 使用 cropper-selection 的 $toCanvas() 方法
    const croppedCanvas = await selectionRef.value.$toCanvas({
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    if (croppedCanvas) {
      croppedImage.value = croppedCanvas.toDataURL('image/png');
      croppedSize.value = `${croppedCanvas.width} x ${croppedCanvas.height}`;
      console.log('裁剪成功！尺寸:', croppedCanvas.width, 'x', croppedCanvas.height);
    }
  } catch (error) {
    console.error('裁剪失敗:', error);
  }
};

// 重置 Cropper
const resetCropper = () => {
  imageUrl.value = null;
  croppedImage.value = null;
  croppedSize.value = '';

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};
</script>

<style scoped>
/* 確保 cropper-canvas 有足夠的空間 */
:deep(cropper-canvas) {
  display: block !important;
  width: 100% !important;
  min-height: 600px !important;
}
</style>
