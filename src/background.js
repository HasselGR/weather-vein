import browser from 'webextension-polyfill'



browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case 'close':
      browser.tabs.remove(sender.tab.id)
      break
    default:
      console.log('ERROR, REQUEST NOT HANDLED', request)
  }
})


const updater = browser.alarms.create('Hourly Updater', {
  delayInMinutes: 60,
  periodInMinutes: 60,
})

browser.alarms.onAlarm.addListener(() => {
  const date = new Date()
  browser.storage.local.get()
    .then(params => {
      // eslint-disable-next-line promise/no-nesting
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${params.city},${params.country}&appid=15d7968a4ea50d6b568a07a54e399358`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          browser.storage.local.set({
            weather: data.weather[0].main,
            icon: data.weather[0].icon,
            description: data.weather[0].description,
            temperature: data.main.temp,
            min_temperature: data.main.temp_min,
            max_temperature: data.main.temp_max,
            feel_temperature: data.main.feels_like,
            humidity: data.main.humidity,
            date: date.toString(),
          })
        })
    })
})


browser.runtime.onInstalled.addListener(function () {
  browser.tabs.create({
    index: 0,
    url: './options.html',
    active: true,
  })
})
