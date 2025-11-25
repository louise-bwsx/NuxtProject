<template>
  <div class="relative flex aaa">
    <div class="dock bg-[#1F276F] text-neutral-content">
      <button>
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <polyline points="1 11 12 2 23 11" fill="none" stroke="currentColor" stroke-miterlimit="10"
              stroke-width="2">
            </polyline>
            <path d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7" fill="none" stroke="currentColor"
              stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path>
            <line x1="12" y1="22" x2="12" y2="18" fill="none" stroke="currentColor" stroke-linecap="square"
              stroke-miterlimit="10" stroke-width="2"></line>
          </g>
        </svg>
        <span class="dock-label">首頁</span>
      </button>

      <button class="dock-active">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <polyline points="3 14 9 14 9 17 15 17 15 14 21 14" fill="none" stroke="currentColor" stroke-miterlimit="10"
              stroke-width="2"></polyline>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor"
              stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect>
          </g>
        </svg>
        <span class="dock-label">訂單</span>
      </button>

      <button>
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-linecap="square"
              stroke-miterlimit="10" stroke-width="2"></circle>
            <path
              d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z"
              fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path>
          </g>
        </svg>
        <span class="dock-label">下單流程</span>
      </button>

      <button>
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-linecap="square"
              stroke-miterlimit="10" stroke-width="2"></circle>
            <path
              d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z"
              fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path>
          </g>
        </svg>
        <span class="dock-label">通知</span>
      </button>

      <button>
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-linecap="square"
              stroke-miterlimit="10" stroke-width="2"></circle>
            <path
              d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z"
              fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path>
          </g>
        </svg>
        <span class="dock-label">帳號</span>
      </button>

    </div>

    <div class="flex absolute z-[20] bottom-20 left-31 aaa">
      <div id="curved-corner-bottomright" class="absolute -top-1 left-2" />
      <div id="circle" class="" />
      <div id="curved-corner-bottomleft" class="absolute -top-1 right-2" />
    </div>
  </div>
</template>

<style scoped>
#curved-corner-bottomleft,
#curved-corner-bottomright {
  width: 40px;
  height: 40px;
  overflow: hidden;
  position: relative;
}

#curved-corner-bottomleft:before,
#curved-corner-bottomright:before {
  content: "";
  display: block;
  width: 200%;
  height: 200%;
  position: absolute;
  border-radius: 50%;
}

#curved-corner-bottomleft:before {
  bottom: 0;
  left: 0;
  box-shadow: -50px 50px 0 0 #1F276F;
}

#curved-corner-bottomright:before {
  bottom: 0;
  right: 0;
  box-shadow: 50px 50px 0 0 #1F276F;
}

#circle {
  width: 50px;
  height: 50px;
  background: #1F276F;
  border-radius: 50%
}
</style>

<!-- <template>
  <div class="flex min-h-[60px] justify-around items-center aaa">
    <ClientOnly>
      <NuxtLink to="/" class="flex flex-col justify-center items-center">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <polyline points="1 11 12 2 23 11" fill="none" stroke="currentColor" stroke-miterlimit="10"
              stroke-width="2">
            </polyline>
            <path d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7" fill="none" stroke="currentColor"
              stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path>
            <line x1="12" y1="22" x2="12" y2="18" fill="none" stroke="currentColor" stroke-linecap="square"
              stroke-miterlimit="10" stroke-width="2"></line>
          </g>
        </svg>
      </NuxtLink>

      <NuxtLink v-if="authStore.isDeveloper" to="/expenditureReport" class="flex flex-col justify-center items-center">
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
          <g id="report_forms_line" fill='none' fill-rule='evenodd'>
            <path
              d='M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z' />
            <path fill='currentColor'
              d='M19 4a2 2 0 0 1 1.995 1.85L21 6v13a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V6a2 2 0 0 1 1.85-1.995L5 4zM8 16H5v3h3zm11 0h-9v3h9zM8 11H5v3h3zm11 0h-9v3h9zM8 6H5v3h3zm11 0h-9v3h9z' />
          </g>
        </svg>
      </NuxtLink>

      <NuxtLink to="/costCharts" class="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 640 640">
          <path fill="currentColor"
            d="M384.4 118L384.4 256L522.4 256C505 188.6 451.9 135.4 384.4 118zM240.4 328L240.4 154.9C165.8 181.3 112.4 252.4 112.4 336C112.4 442 198.4 528 304.4 528C329 528 352.4 523.4 373.9 515.1L257 373.9C246.3 361 240.4 344.7 240.4 328zM574.3 272.1C576.6 289.6 562.1 304 544.4 304L368.4 304C350.7 304 336.4 289.7 336.4 272L336.4 96C336.4 78.3 350.8 63.8 368.3 66.1C475.3 80.3 560.1 165.1 574.3 272.1zM288.4 130.7L288.4 328C288.4 333.6 290.4 339 293.9 343.3L426 502.7C437.7 516.8 435.2 538.1 419.1 546.8C385 565.4 345.9 576 304.4 576C171.9 576 64.4 468.5 64.4 336C64.4 220.5 145.9 124.1 254.6 101.2C272.7 97.4 288.4 112.2 288.4 130.7zM573.7 352C592.2 352 607 367.7 603.2 385.8C593 434.2 568.2 477.2 533.6 510C521.3 521.7 502 519.2 491.2 506.1L406.9 404.4C389.6 383.5 404.5 352 431.5 352L573.7 352z" />
        </svg>
      </NuxtLink>

      <NuxtLink to="/notes" class="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path
            d="M440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6q47 0 91.5 10.5T440-278Zm40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-481q15 5 29.5 11t28.5 14q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm140-240v-440l120-40v440l-120 40Zm-340-99Z" />
        </svg>
      </NuxtLink>

      <NuxtLink to="/currencyConverter" class="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path
            d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40Zm-36-160v-52q-47-11-76.5-40.5T324-370l66-26q12 41 37.5 61.5T486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-50h70v50q36 3 65.5 29t40.5 61l-64 26q-8-23-26-38.5T482-648q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v50h-70ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Z" />
        </svg>
      </NuxtLink>

      <NuxtLink to="/drywall" class="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-wall">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
          <path d="M4 8h16" />
          <path d="M20 12h-16" />
          <path d="M4 16h16" />
          <path d="M9 4v4" />
          <path d="M14 8v4" />
          <path d="M8 12v4" />
          <path d="M16 12v4" />
          <path d="M11 16v4" />
        </svg>
      </NuxtLink>

      <NuxtLink v-if="authStore.isDeveloper" to="/game" class="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-device-gamepad-2">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M12 5h3.5a5 5 0 0 1 0 10h-5.5l-4.015 4.227a2.3 2.3 0 0 1 -3.923 -2.035l1.634 -8.173a5 5 0 0 1 4.904 -4.019h3.4z" />
          <path d="M14 15l4.07 4.284a2.3 2.3 0 0 0 3.925 -2.023l-1.6 -8.232" />
          <path d="M8 9v2" />
          <path d="M7 10h2" />
          <path d="M14 10h2" />
        </svg>
      </NuxtLink>
    </ClientOnly>
  </div>
</template> -->
