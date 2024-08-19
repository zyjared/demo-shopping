/*
 * 依赖 $accounts
 */

(function () {
  window.addEventListener('load', layoutHeader)

  async function layoutHeader() {
    const user = $accounts.redirectIfNotLogin()
    if (!user)
      return

    document.querySelector('header .user .username').textContent = user.username
    document.querySelector('header .user .avatar-container').append($element.create('img', {
      alt: `${user.usename}的头像`,
      src: user.avatar,
      class: 'avatar',
    }))
  }
})()
