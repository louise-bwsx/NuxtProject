import MarkdownIt from 'markdown-it'

// 配置 markdown-it（模組層級只建立一次）
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 顯示md裡面的圖片
const originalImageRender = md.renderer.rules.image
md.renderer.rules.image = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const src = token.attrs[token.attrIndex('src')][1]

  // 為了讓dev production都看到同一個圖片
  if (src.includes('http://localhost:5001')) {
    token.attrs[token.attrIndex('src')][1] = src.replace('http://localhost:5001', import.meta.env.VITE_BASE_URL)
  }

  return originalImageRender ? originalImageRender(tokens, idx, options, env, renderer) : renderer.renderToken(tokens, idx, options)
}

// source: ref / getter / 字串
export const useMarkdown = (source) => {
  // 計算渲染後的 HTML
  const html = computed(() => {
    const text = toValue(source)
    return text ? md.render(text) : ''
  })

  return { html }
}
