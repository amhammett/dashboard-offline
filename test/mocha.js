'use strict'

const expect = require('chai').expect
const fs = require('fs')
const screenshot = require('../src/screenshot')
const dist = process.env.SAVE_DIR || './dist'
const save_dir = dist + '/'

describe('Download pages for offline usage', function() {
  const test_data = require('./data/test.json')

  test_data.verify_download.pages.forEach(function(page) {
    it('screenshot ' + page.id, function(done) {
      this.timeout(10000)
      const params = {
        screen_width: test_data.screenshots.width,
        screen_height: test_data.screenshots.height,
        page_url: page.url,
        page_id: page.id,
        save_dir: save_dir
      }

      try {
        screenshot.handler(params)
          .then(function () {
            expect(fs.existsSync(save_dir + page.id + '.png')).to.be.true
          }).then(function() {
            done()
          })
      } catch (error) {
        done(error)
      }
    })
  })
})
