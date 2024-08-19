/*
 * 依赖文件:
 * - api.js
 */

const $accounts = (function () {

  /** 注册成功时默认头像路径 */
  const DEFAULT_AVATAR = '/assets/images/bg.jpg'

  /** 登录状态的临时存储键 */
  const SESSION_LOGIN_KEY = 'isLogin'

  /** 忽略检查登录状态的页面，使用绝对路径检查 */
  const NO_CHECK_PAGES = ['/pages/login.html', '/pages/signup.html']

  /** 如果未登录，默认跳转的页面 */
  const REDIRECT_IF_NOT_LOGIN = '/pages/login.html'

  /** 登陆后跳转到的页面 */
  const AFTER_LOGIN_PAGE = "/pages/home.html"

  // 当导入该模块的时候，自动检查登录状态
  window.addEventListener('load', () => {
    redirectIfNotLogin(REDIRECT_IF_NOT_LOGIN)
  })

  // 当前登录用户数据
  let currentAccount = null

  /**
   * 检查登录状态
   * @returns {Record<string, any> | null} 登录时返回登录数据，否则为 null
   */
  function isLogin() {
    if (!currentAccount) {
      const data = sessionStorage.getItem(SESSION_LOGIN_KEY)

      if (data) {
        currentAccount = JSON.parse(data)
      }
    }

    return currentAccount
  }

  /**
   * 检查登录状态，并且在未登录的情况下直接跳转到指定页面
   */
  function redirectIfNotLogin(path = REDIRECT_IF_NOT_LOGIN, exclude = NO_CHECK_PAGES) {
    const loginData = isLogin()
    if (loginData) {
      return loginData
    }

    if (exclude.includes(window.location.pathname))
      return

    window.location.href = path
  }

  /**
   * 保存登录状态
   * @param {object} data - 一些数据
   */
  function _sessionLogin(data) {
    currentAccount = data
    sessionStorage.setItem(SESSION_LOGIN_KEY, JSON.stringify(data))
  }

  /**
   * 退出账号时清理
   */
  function _sessionLogout() {
    currentAccount = null
    sessionStorage.removeItem(SESSION_LOGIN_KEY)
  }

  // =============================================

  /** 错误提醒的工具函数 */
  function setErrorText(text, selector = '.error') {
    const elementError = document.querySelector(selector)
    elementError.textContent = text || ''

    // 加一点动画效果
    if (text) {
      // 输入不变的情况下，确保点击注册也会开始动画
      elementError.classList.remove('ani-shake')
      setTimeout(() => {
        elementError.classList.add('ani-shake')
      }, 0)
    }
    else {
      elementError.classList.remove('ani-shake')
    }
  }

  /**
   * 注册
   */
  async function signup() {
    const elementName = document.querySelector('.signup .username')
    const elementPass = document.querySelector('.signup .password')
    const elementConfirmPass = document.querySelector('.signup .confirm-password')

    const username = elementName.value
    const password = elementPass.value
    const confirmPassword = elementConfirmPass.value

    if (!username || !password || !confirmPassword) {
      return setErrorText('请正确输入账号和密码。')
    }

    if (password !== confirmPassword) {
      return setErrorText('输入的两次密码不一致')
    }

    if (await $api.findData($api.keys.users, username)) {
      return setErrorText('用户名已存在，请重新输入。')
    }

    const resultSignup = await $api.setData($api.keys.users, username, { password, avatar: DEFAULT_AVATAR })

    if (!resultSignup) {
      setErrorText('注册失败，未知错误。')
      return
    }

    alert('注册成功')

    elementName.value = ''
    elementPass.value = ''
    elementConfirmPass.value = ''
    setErrorText()

    window.location.href = `login.html?username=${username}`
  }

  /**
   * 登录
   */
  async function login() {
    const elementName = document.querySelector('.login .username')
    const elementPass = document.querySelector('.login .password')

    const username = elementName.value
    const password = elementPass.value

    if (!username || !password) {
      return setErrorText('请正确输入账号和密码。')
    }

    const data = await $api.findData($api.keys.users, username)

    if (data && data.password === password) {
      _sessionLogin({ username, ...data, password: undefined }) // 保存登录状态

      window.location.href = AFTER_LOGIN_PAGE
    }
    else if (data && data.password !== password) {
      setErrorText('密码错误，请重新输入！')
    }
    else {
      setErrorText('账号不存在！')
    }
  }

  /**
   * 登出
   */
  function logout(path = REDIRECT_IF_NOT_LOGIN) {
    _sessionLogout(path)
    window.location.href = path
  }

  return {
    isLogin,
    redirectIfNotLogin,
    signup,
    login,
    logout,
    setErrorText
  }
})()

const login = $accounts.login
const signup = $accounts.signup
const logout = $accounts.logout