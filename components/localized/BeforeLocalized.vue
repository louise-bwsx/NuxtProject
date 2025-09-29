<template>
  <div class="grow ">
    <div>BeforeLocalized</div>

    <!-- t() - 基本翻譯函數 -->
    <!-- 用於一般的文字翻譯，不處理複數問題： -->
    <h1>$t('welcome')</h1>
    <p>$t('about')</p>

    <!-- 巢狀翻譯 -->
    <nav>
      <a href="#">$t('menu.products')</a>
      <a href="#">$t('menu.services')</a>
    </nav>

    <!-- 根據 appleCount 的值，自動選擇對應的文字 -->
    <!-- 參數1: key, 參數2: index 在json用|隔開所以1 的時候會有AAA, 參數3: 變數 -->
    <!-- 不需要改成$tc 反而會Error -->
    <p>$t('apple', props.appleCount, { count: props.appleCount })</p>
    <p>$t('message', props.messageCount, { count: props.messageCount })</p>
    <p>$t('item', props.itemCount, { count: props.itemCount })</p>

    <!-- 按鈕 -->
    <button>$t('button.submit')</button>

    <p>$t('greeting', { name: props.name, date: props.date })</p>

    <div>
      <p>當前語言：props.i18n.locale</p>
      <p>可用語言：props.i18n.locales</p>
    </div>
  </div>
</template>