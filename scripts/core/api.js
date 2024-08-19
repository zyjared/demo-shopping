/*
 * 存储在 localStorage 中的数据
 */

const $api = (function () {
  const USERS_KEY = 'users'
  const PRODUCTS_KEY = 'products'
  const CARTS_KEY = 'carts'

  /**
   * 获得指定数据，默认值在 /assets/data 中
   * @param {string} tableKey localStorage 密钥
   * @returns {Promise<Record<string, any>>} 请求 json 数
   */
  async function _fetchTable(tableKey) {
    const data = await fetch(`/assets/data/${tableKey}.json`).then(res => res && res.json())

    return data || {}
  }

  /**
   * 保存数据表
   * @param {string} tableKey localStorage 密钥
   * @param data
   */
  function _saveTable(tableKey, data) {
    localStorage.setItem(tableKey, JSON.stringify(data))
  }

  /**
   * 获得数据表
   * @param {string} tableKey localStorage 密钥
   * @returns {Promise<Record<string, any>>} 数据表数据
   */
  async function getTableData(tableKey) {
    const table = localStorage.getItem(tableKey)
    if (table) {
      return JSON.parse(table)
    }
    else {
      const data = await _fetchTable(tableKey)
      localStorage.setItem(tableKey, JSON.stringify(data))

      return data
    }
  }

  /**
   * 增、改：写入指定表的指定键 的数据
   * @param {string} tableKey localStorage 密钥
   * @param {string} key
   * @param {object | Array} data
   * @returns {Promise<Record<string, any>|any[]>} 最新数据
   */
  async function setData(tableKey, key, data) {
    const table = await getTableData(tableKey)
    try {
      table[key] = Array.isArray(data) ? data : { ...(table[key] || {}), ...data }
      _saveTable(tableKey, table)
      return table[key]
    }
    catch (err) {
      console.error(`操作 ${tableKey} 失败：`, err)
      return null
    }
  }

  /**
   * 查：获得指定表的指定键 的数据
   * @param {string} tableKey localStorage 密钥
   * @param {string} key
   * @returns {Promise<Record<string, any>|any[]>} 指定键的数据
   */
  async function findData(tableKey, key) {
    return (await getTableData(tableKey))[key]
  }

  /**
   * 删：删除指定表的指定键 的数据
   * @param {string} tableKey localStorage 密钥
   * @param {string} key
   */
  async function deleteData(tableKey, key) {
    const data = await getTableData(tableKey)
    if (Object.hasOwn(data, key)) {
      delete data[key]
      _saveTable(tableKey, data)
    }
  }

  /**
   * clear：清空指定数据表
   * @param {string} tableKey localStorage 密钥
   */
  function clearTableData(tableKey) {
    localStorage.removeItem(tableKey)
  }

  function clear() {
    const opt = confirm('将清理本地所有存储，确定吗？')
    if (!opt)
      return
    clearTableData(CARTS_KEY)
    clearTableData(PRODUCTS_KEY)
    clearTableData(USERS_KEY)

    alert('清理本地存储: 成功')
  }


  return {
    keys: {
      users: USERS_KEY,
      products: PRODUCTS_KEY,
      carts: CARTS_KEY,
    },
    getTableData,
    setData,
    findData,
    deleteData,
    clearTableData,
    clear
  }
})()
