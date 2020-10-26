/* eslint-disable promise/no-nesting */
import browser from 'webextension-polyfill'



let temperature = document.getElementById('temperature')
let weather = document.getElementById('weather')
let humidity = document.getElementById('humidity')
let footer = document.getElementById('footer')

const addTitle = (type, string) => {
  let header = document.createElement('h1')
  header.appendChild(document.createTextNode(`${string}`))
  type.appendChild(header)

}

const addInfo = (type, string, info) => {
  let header = document.createElement('p')
  header.appendChild(document.createTextNode(`${string}: ${info}`))
  type.appendChild(header)
}


const addImage = (type, string) => {
  let header = document.createElement('img')
  header.setAttribute('width', '150')
  header.setAttribute('height', '150')
  header.setAttribute('src', `http://openweathermap.org/img/wn/${string}@2x.png`)
  type.appendChild(header)
}


const addWeather = () => {
  const city = browser.storage.local.get()
  city.then(data => {
    console.log(data)
    addTitle(temperature, browser.i18n.getMessage('temperature'))
    addTitle(weather, browser.i18n.getMessage('weather'))
    addTitle(humidity, browser.i18n.getMessage('humidity'))
    addInfo(weather, browser.i18n.getMessage('weatherParameter'), data.weather)
    addImage(weather, data.icon)
    addInfo(weather, browser.i18n.getMessage('weatherDescription'), data.description)
    addInfo(temperature, browser.i18n.getMessage('temperatureWeather'), data.temperature)
    addInfo(temperature, browser.i18n.getMessage('minimumTemperature'), data.min_temperature)
    addInfo(temperature, browser.i18n.getMessage('maximumTemperature'), data.max_temperature)
    addInfo(temperature, browser.i18n.getMessage('feelTemperature'), data.feel_temperature)
    addInfo(humidity, browser.i18n.getMessage('humidityWeather'), data.humidity)
    addInfo(footer, 'Last updated since', data.date)
  }).catch(error => console.log(error))
}


addWeather()
