/* eslint-disable promise/no-nesting */
import browser from 'webextension-polyfill'


//first we get all the elemets to fill the info up, with the new layout some of them will be not required


let location = document.getElementById('city')
let place = document.getElementById('place')
let temperature = document.getElementById('temperature')
let weather = document.getElementById('weather')
let humidity = document.getElementById('humidity')
let footer = document.getElementById('footer')
let input = document.getElementById('userinput')
let button = document.getElementById('submit')

//not needed as we wont add something to change cities
const clearNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

//pretty self explanatory, it just adds the headline, we do it this way for i18 purposes, you send the size of the header, what its going to say and where it will be attached to


const addTitle = (type, string, size = 'h1') => {
  let header = document.createElement(size)
  header.appendChild(document.createTextNode(`${string}`))
  type.appendChild(header)
}
//for not so important info. same as before

const addInfo = (type, string, info) => {
  let header = document.createElement('p')
  header.appendChild(document.createTextNode(`${string}: ${info}`))
  type.appendChild(header)
}

//to add images, we should change this.
const addImage = (type, string) => {
  let header = document.createElement('img')
  header.setAttribute('width', '150')
  header.setAttribute('height', '150')
  header.setAttribute('src', `http://openweathermap.org/img/wn/${string}@2x.png`)
  type.appendChild(header)
}
//this is the bread and butter, we take the data from the local storage and we add it to the popup.
const addWeather = () => {
  const city = browser.storage.local.get()
  city.then(data => {
    console.log(data)
    addTitle(place, `Ciudad: ${data.city}`, 'h3')
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
    addInfo(humidity, browser.i18n.getMessage('humidityWeather'), `${data.humidity}%`)
    addInfo(footer, 'Last updated since', `${data.date.substr(0, 10)} ${data.date.substr(11, 14)}`)
  }).catch(error => console.log(error))
}
//method for changing the city, i think this is not needed anymore either
const changeCity = () => {
  const req = browser.storage.local.get('country')
  req.then(data => {
    let assignment = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value},${data.country}&appid=15d7968a4ea50d6b568a07a54e399358`)
    assignment.then(response => {
      if (response.status === 200) {
        console.log('valid combination')
        response.json()
          .then(info => {
            const temperatureNew = parseFloat((info.main.temp - 273).toFixed(2))
            const minimumTemp = parseFloat((info.main.temp_min - 273).toFixed(2))
            const maximumTemp = parseFloat((info.main.temp_max - 273).toFixed(2))
            const feelsTemp = parseFloat((info.main.feels_like - 273).toFixed(2))
            const date = new Date()
            console.log('date', date)
            browser.storage.local.set({
              city: input.value,
              weather: info.weather[0].main,
              icon: info.weather[0].icon,
              description: info.weather[0].description,
              temperature: `${temperatureNew}ºC`,
              min_temperature: `${minimumTemp}ºC`,
              max_temperature: `${maximumTemp}ºC`,
              feel_temperature: `${feelsTemp}ºC`,
              humidity: info.main.humidity,
              date: date.toString(),
            })
          })
          .catch(error => console.log(error))
      } else {
        console.log('Not a valid combination')
      }
    })
  }).catch(error => console.log(error))
}

//just in case we change the storage, not needed
browser.storage.onChanged.addListener(() => {
  clearNode(place)
  clearNode(temperature)
  clearNode(weather)
  clearNode(humidity)
  clearNode(footer)
  addWeather()
})

button.addEventListener('click', changeCity)


addWeather()
