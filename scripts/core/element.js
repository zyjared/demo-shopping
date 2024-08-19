const $element = (function () {

  /**
   * 创建一个指定类型的 HTML 元素并设置其属性
   *
   * 如果传入了事件属性，请在适当的时机执行 element.removeEventListeners()
   *
   * @param {string} elementName - 元素名称
   * @param {object} attributes - 属性对象
   * @returns {HTMLElement} 创建的 HTML 元素
   */
  function create(elementName, attributes = {}) {
    const element = document.createElement(elementName)

    for (const key of Object.keys(attributes)) {
      if (key === 'textContent') {
        element.textContent = attributes[key]
      }
      else if (key === 'style') {
        Object.assign(element.style, attributes[key])
      }
      else if (key === 'children') {
        const elements = attributes[key]
        if (Array.isArray(elements)) {
          element.append(...elements)
        }
        else {
          element.appendChild(elements)
        }
      }
      else if (key === 'events') {
        for (const event in attributes[key]) {
          const handler = attributes[key][event]
          element.addEventListener(event, handler)

          // 将事件函数存储在元素上，方便移除
          if (!element._eventHandlers) {
            element._eventHandlers = {}
          }
          element._eventHandlers[event] = handler
        }

        element.removeEventListeners = function () {
          if (this._eventHandlers) {
            for (const event in this._eventHandlers) {
              this.removeEventListener(event, this._eventHandlers[event])
            }
            this._eventHandlers = null // 清空事件处理函数列表
          }
        }
      }
      else if (key === 'innerHTML') {
        element.innerHTML = attributes[key]
      }
      else if (key === 'dataset') {
        Object.assign(element.dataset, attributes[key])
      }
      else {
        element.setAttribute(key, attributes[key])
      }
    }

    return element
  }

  function svg(svgName, attributes = {}) {
    return $element.create('img', {
      alt: `${svgName}图`,
      src: `/assets/svg/${svgName}.svg`,
      ...attributes,
      style: {
        display: 'inline-block',
        width: '1rem',
        height: '1rem',
        ...(attributes.style || {}),
      },
    })
  }

  return {
    create,
    svg
  }
})()

