const $table = (function () {
/**
 * 根据值生成 Element
 * @param {any} value - 要设置的值
 * @returns {Element} Element
 */
  function genCellValue(value) {
    if (value instanceof Element) {
      return value
    }

    let text
    if (typeof value === 'string') {
      text = value
    }
    else if (typeof value === 'number') {
      text = `${value}`
    }
    else if (value === null) {
      text = 'null'
    }
    else if (value === undefined) {
      text = 'undefined'
    }
    else if (value instanceof Function) {
      text = value.toString()
    }
    else {
      try {
        text = JSON.stringify(value)
      }
      catch (err) {
        console.error(`不能转换的类型：`, err)
        text = ''
      }
    }

    return document.createTextNode(text)
  }

  function genTableRef(elementOrSelector) {
    return elementOrSelector instanceof Element ? elementOrSelector : document.querySelector(elementOrSelector)
  }

  /**
   * 增、改，添加表格数据，如果已经存在，则修改
   * @param {string|Element} tableSelector - 表格选择器
   * @param {number} indexRow - 行索引
   * @param {number} indexCell - 单元格索引
   * @param {any} value - 任意值，非 Element 将转为 string
   * @returns {HTMLTableCellElement | null} 未匹配 table 则返回 null；成功则返回 cell
   */
  function setCell(tableSelector, indexRow, indexCell, value) {
    const tableRef = genTableRef(tableSelector)

    if (!tableRef) {
      console.error('未找到 table')
      return null
    }

    let row = tableRef.rows[indexRow]
    if (!row) {
      row = tableRef.insertRow(indexRow)
    }

    let cell = row.cells[indexCell]

    if (!cell) {
      cell = row.insertCell(indexCell)
    }
    else {
      cell.innerHTML = ''
    }

    cell.appendChild(genCellValue(value))

    return cell
  }

  /**
   * 增、改，添加一行数据，如果已经存在则修改
   * @param {string|Element} tableSelector - 表格选择器
   * @param {number} indexRow - 行索引
   * @param {Array<any>} list - 包含每个单元格数据的数组
   * @returns {HTMLTableRowElement | null} 未匹配 table 则返回 null；成功则返回 row
   */
  function setRow(tableSelector, indexRow, list, options = {}) {
    const tableRef = genTableRef(tableSelector)
    if (!tableRef) {
      console.error('未找到 table')
      return null
    }

    let row = tableRef.rows[indexRow]
    if (!row) {
      row = tableRef.insertRow(indexRow)
    }
    else {
      row.innerHTML = ''
    }

    list.forEach((value, index) => {
      if (options.type === 'th') {
        const cell = ($element.create('th'))
        cell.append(genCellValue(value))
        row.appendChild(cell)
      }
      else {
        const cell = row.insertCell(index)
        cell.appendChild(genCellValue(value))
      }
    })

    return row
  }

  /**
   * 删，删除表格中的指定行
   * @param {string|Element} tableSelector - 表格选择器
   * @param {number} indexRow - 要删除的行索引
   * @returns {number | null | undefined} 未匹配 table 则返回 null；未匹配行则 undefined; 成功则返回 行索引
   */
  function deleteRow(tableSelector, indexRow) {
    const tableRef = genTableRef(tableSelector)
    if (!tableRef) {
      console.error('未找到 table')
      return null
    }

    if (indexRow < 0 || indexRow >= tableRef.rows.length) {
      console.error('无效的行索引')
      return undefined
    }

    tableRef.deleteRow(indexRow)

    return indexRow
  }

  return {
    setCell,
    setRow,
    deleteRow
  }

})()
