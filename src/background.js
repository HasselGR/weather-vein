import browser from 'webextension-polyfill'


let city = ''
let country = ''

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
          const temperature = parseFloat((data.main.temp - 273).toFixed(2))
          const minimumTemp = parseFloat((data.main.temp_min - 273).toFixed(2))
          const maximumTemp = parseFloat((data.main.temp_max - 273).toFixed(2))
          const feelsTemp = parseFloat((data.main.feels_like - 273).toFixed(2))
          browser.storage.local.set({
            weather: data.weather[0].main,
            icon: data.weather[0].icon,
            description: data.weather[0].description,
            temperature: `${temperature}ºC`,
            min_temperature: `${minimumTemp}ºC`,
            max_temperature: `${maximumTemp}ºC`,
            feel_temperature: `${feelsTemp}ºC`,
            humidity: data.main.humidity,
            date: date.toString(),
          })
        })
    })
})


browser.runtime.onInstalled.addListener(function () {
  fetch('http://api.ipstack.com/check?access_key=46d55efd82cf8067ed7c334ec534bb52')
    .then(response => response.json())
    .then(data => {
      console.log('you are fetching from', data)
      city = data.city
      country = data.country_code
      // eslint-disable-next-line promise/no-nesting
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=15d7968a4ea50d6b568a07a54e399358`)// No entiendo porque si dejo de anidar los fetchs no me funciona el scope.
        .then(response => response.json())
        .then(info => {
          console.log('city', city)
          console.log('country', country)
          console.log('weather from ipstack', info)
          const temperature = parseFloat((info.main.temp - 273).toFixed(2))
          const minimumTemp = parseFloat((info.main.temp_min - 273).toFixed(2))
          const maximumTemp = parseFloat((info.main.temp_max - 273).toFixed(2))
          const feelsTemp = parseFloat((info.main.feels_like - 273).toFixed(2))
          const date = new Date()
          console.log('date', date)
          browser.storage.local.set({
            country: country,
            city: city,
            weather: info.weather[0].main,
            icon: info.weather[0].icon,
            description: info.weather[0].description,
            temperature: `${temperature}ºC`,
            min_temperature: `${minimumTemp}ºC`,
            max_temperature: `${maximumTemp}ºC`,
            feel_temperature: `${feelsTemp}ºC`,
            humidity: info.main.humidity,
            date: date.toString(),
          })
        })
    }).catch(error => console.log(error))
})
