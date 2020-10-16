import browser from 'webextension-polyfill'



browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case 'close':
      console.log('Close is reaching.')
      browser.tabs.remove(sender.tab.id)
      break
    default:
      console.log('ERROR, REQUEST NOT HANDLED', request)
  }
})
browser.runtime.onInstalled.addListener(function () {
  browser.tabs.create({
    index: 0,
    url: './options.html',
    active: true,
  })
})
