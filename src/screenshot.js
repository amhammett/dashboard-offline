'use strict'

const puppeteer = require('puppeteer')

const debug = process.env.DEBUG || false
const auth_domain = process.env.AUTH_DOMAIN || ''
const auth_user = process.env.AUTH_USER
const auth_pass = process.env.AUTH_PASS

async function login_before_screenshot (page, data) {
  debug && console.log('\t loging enabled')
  await page.goto(data.login.login_url)

  if (data.login.login_domain) {
    debug && console.log('\t loging domain')
    await page.select(data.login.login_domain, auth_domain)
  }

  await page.type(data.login.login_user, auth_user)
  await page.type(data.login.login_pass, auth_pass)
  debug && await page.screenshot({ path: data.save_dir +'_1_fields.png' })
  await page.click(data.login.login_button)

  debug && await page.screenshot({ path: data.save_dir +'_2_click.png' })
  await page.waitForNavigation()

  debug && await page.screenshot({ path: data.save_dir +'_3_login.png' })
}

async function authenticate (page) {
  debug && console.log('\t authentication enabled')
  await page.authenticate({
    username: auth_user,
    password: auth_pass
  })
}

module.exports.handler = async(data) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({
    width: data.screen_width,
    height: data.screen_height,
  })

  if (data.authenticate) {
    await authenticate(page)
  }

  if (data.login) {
    await login_before_screenshot(page, data)
  }

  await page.goto(data.page_url, {waitUntil: 'networkidle2'})

  if (data.wait_for) {
    debug && console.log('\t waiting .. ' + data.page_url)
    await page.waitFor(data.wait_for)
  }

  await page.screenshot({path: data.save_dir + data.page_id + '.png'})
  await browser.close()
}