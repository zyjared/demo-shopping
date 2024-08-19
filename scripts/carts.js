/*
 * 依赖:
 * - $api
 * - $accounts
 */

const $carts = (function () {

  // 购物车数据
  let cartList

  /**
   * 获得 cartList
   * @returns {Promise<object[]>} 购物车条目
   */
  async function getList() {
    if (!cartList) {
      const user = $accounts.redirectIfNotLogin()
      if (!user)
        return
      const carts = await $api.findData($api.keys.carts, user.username)
      cartList = carts || []
    }
    return cartList
  }

  // =======================================

  async function deleteItem(cartItemId) {
    const list = await getList()
    const index = list.findIndex(d => d.id === cartItemId)

    if (index === -1) {
      // 不期望的结果
      console.error(`更新购物车数据出错, id: ${cartItemId}`)
      return
    }
    list.splice(index, 1)

    const user = $accounts.redirectIfNotLogin()
    return await $api.setData($api.keys.carts, user.username, list)
  }

  async function updateItem(cartItemId, data) {
    const list = await getList()
    const index = list.findIndex(d => d.id === cartItemId)

    if (index === -1) {
      // 不期望的结果
      console.error(`更新购物车数据出错, id: ${cartItemId}`)
      return
    }

    list[index] = { ...list[index], ...data }

    const user = $accounts.redirectIfNotLogin()
    return await $api.setData($api.keys.carts, user.username, list)
  }

  /**
   * 加入产品到购物车
   * @param {Record<string, any>} product 数据
   * @returns 最新结果
   */
  async function addItem(product) {
    const list = await getList()

    const index = list.findIndex(item => item.id === product.id)

    if (index === -1) {
      const data = {
        ...product,
        count: 1,
      }
      list.unshift(data)
    }
    else {
      list[index].count = list[index].count + 1

      // 移动到首个
      const moves = list.splice(index, 1)
      list.unshift(moves[0])
    }

    const user = $accounts.redirectIfNotLogin()
    return await $api.setData($api.keys.carts, user.username, list)
  }

  // =======================================

  async function hasProduct(productOrId) {
    const list = await getList()
    let id = typeof product === 'number' ? productOrId : productOrId.id
    return list.find(el => el.id === id)
  }

  return {
    getList,
    deleteItem,
    updateItem,
    addItem,
    hasProduct
  }

})()