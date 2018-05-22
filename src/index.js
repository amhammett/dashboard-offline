const screenshot = require('./screenshot')
const data = require('../data/resources.json')

const dist = process.env.SAVE_DIR || './dist'
const save_dir = dist + '/'

data.pages.forEach(function(page) {
  console.log('page: ' + page.id)
  let params = {
    screen_width: data.screenshots.width,
    screen_height: data.screenshots.height,
    page_url: page.url,
    page_id: page.id,
    authenticate: page.authenticate || false,
    save_dir: save_dir,
    wait_for: page.wait_for || false
  }

  if (page.login) {
    params.login = {
      login_url: page.login.url,
      login_domain: page.login.login_domain || false,
      login_user: page.login.login_user,
      login_pass: page.login.login_pass,
      login_button: page.login.login_button
    }
  }

  screenshot.handler(params)
})