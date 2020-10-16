/* eslint-disable promise/no-nesting */
import browser from 'webextension-polyfill'



let temperature = document.getElementById('temperature')
let weather = document.getElementById('weather')
let humidity = document.getElementById('humidity')


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
    addInfo(weather, 'Parameter', data.weather)
    addImage(weather, data.icon)
    addInfo(weather, 'Description', data.description)
    addInfo(temperature, 'Temperature', data.temperature)
    addInfo(temperature, 'Minimum temperature', data.min_temperature)
    addInfo(temperature, 'Maximum Temperature', data.max_temperature)
    addInfo(temperature, 'Real Feel Temperature', data.feel_temperature)
    addInfo(humidity, 'Humidity', data.humidity)
  }).catch(error => console.log(error))
}


addWeather()
