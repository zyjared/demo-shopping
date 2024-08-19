/*
 * 该文件不应该成为其他模块的依赖，并且在 body 最后引入
 *
 * 也就是有没有这个模块都不影响
 *
 * 依赖
 *  - core/element.js
 */

(function () {
  const darkSvg = $element.svg('moon')
  const lightSvg = $element.svg('sun')

  // 初始化一下主题
  colorMode(localStorage.getItem('colorMode'))

  const btn = $element.create('button', {
    type: 'button',
    title: 'color mode',
    style: {
      position: 'fixed',
      right: '.5rem',
      bottom: '.5rem',
      zIndex: '999',
      borderRadius: '999px',
      borderColor: 'rgba(var(--text-rgb), .1)',
      background: 'rgba(var(--bg-rgb), .3)',
    },
    events: {
      click: () => colorMode(), // 点击时不传参
    },
    children: [darkSvg, lightSvg],
  })

  document.body.appendChild(btn)

  /**
   * 切换网页颜色模式
   */
  function colorMode(mode = null) {
    const body = document.body

    let isDark = mode ? mode === 'light' : body.classList.contains('dark')
    if (isDark) {
      body.classList.remove('dark')
      body.classList.add('light')
      darkSvg.style.display = 'block'
      lightSvg.style.display = 'none'
      localStorage.setItem('colorMode', 'light')
    }
    else {
      body.classList.remove('light')
      body.classList.add('dark')
      darkSvg.style.display = 'none'
      lightSvg.style.display = 'block'
      localStorage.setItem('colorMode', 'dark')
    }
  }
})()
