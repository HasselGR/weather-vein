/* eslint-disable promise/no-nesting */
import browser from 'webextension-polyfill'


// first we get all the elemets to fill the info up, with the new layout some of them will be not required


let city = document.getElementById('city')
let date = document.getElementById('date')
let weather = document.getElementById('weather')
let temperature = document.getElementById('temperature')
let imageweather = document.getElementById('imageweather')
let humidity = document.getElementById('humidity')
let footer = document.getElementById('footer')


// not needed as we wont add something to change cities

const clearNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

// pretty self explanatory, it just adds the headline, we do it this way for i18 purposes, you send the size of the header, what its going to say and where it will be attached to


const addTitle = (type, string, size = 'h1') => {
  let header = document.createElement(size)
  header.appendChild(document.createTextNode(`${string}`))
  type.appendChild(header)
}
// for not so important info. same as before

const addInfo = (type, string, info) => {
  let header = document.createElement('p')
  header.appendChild(document.createTextNode(`${string}: ${info}`))
  type.appendChild(header)
}

const changeText = (location, string) => {
  location.innerHTML = `${string}`
}

// to add images, we should change this.
const addImage = (type, string) => {
  let header = document.createElement('img')
  header.setAttribute('width', '150')
  header.setAttribute('height', '150')
  header.setAttribute('src', `http://openweathermap.org/img/wn/${string}@2x.png`)
  type.appendChild(header)
}

const getWeather = (clima) => {
  switch (clima) {
    case 'Thunderstorm':
      return 'Tormenta'
    case 'Drizzle':
      return 'Llovizna'
    case 'Rain':
      return 'Lluvia'
    case 'Snow':
      return 'Granizo'
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Dust':
    case 'Fog':
    case 'Sand':
    case 'Ash':
    case 'Squall':
    case 'Tornado':
      return 'Niebla'
    case 'Clear':
      return 'Despejado'
    case 'Clouds':
      return 'Nublado'

  }

}

const getWeatherImg = (description) => {
  switch (description) {
    case 'thunderstorm with light rain':
    case 'thunderstorm with rain':
    case 'thunderstorm with heavy rain':
    case 'light thunderstorm':
    case 'thunderstorm':
    case 'heavy thunderstorm':
    case 'ragged thunderstorm':
    case 'thunderstorm with light drizzle':
    case 'thunderstorm with heavy drizzle':
      return 'thunderstorm'
    case 'light intensity drizzle':
    case 'drizzle':
    case 'heavy intensity drizzle':
    case 'light intensity drizzle rain':
    case 'drizzle rain':
    case 'heavy intensity drizzle rain':
    case 'shower rain and drizzle':
    case 'heavy shower rain and drizzle':
    case 'shower drizzle':
    case 'light intensity shower rain':
    case 'shower rain':
    case 'heavy intensity shower rain':
    case 'ragged shower rain':
      return 'drizzle'
    case 'light rain':
    case 'moderate rain':
    case 'heavy intensity rain':
    case 'very heavy rain':
    case 'extreme rain':
      return 'rain'
    case 'freezing rain':
    case 'light snow':
    case 'snow':
    case 'heavy snow':
    case 'sleet':
    case 'Light shower sleet':
    case 'Shower sleet':
    case 'Light rain and snow':
    case 'rain and snow':
    case 'light shower snow':
    case 'shower snow':
    case 'heavy shower snow':
      return 'snow'
    case 'mist':
    case 'smoke':
    case 'haze':
    case 'sand whirls':
    case 'dust whirls':
    case 'fog':
    case 'sand':
    case 'dust':
    case 'volcanic ash':
    case 'squalls':
    case 'tornado':
      return 'mist'
    case 'clear sky':
      return 'clear'
    case 'few clouds':
      return 'few clouds'
    case 'scattered clouds':
      return 'scattered clouds'
    case 'broken clouds':
      return 'broken clouds'
    case 'overcast clouds':
      return 'overcast clouds'
  }
}

const translateDate = (date) => {
  let day = ''
  let month = ''
  let number = date.slice(8, 10)
  switch (date.slice(0, 3)) {
    case 'Mon':
      day = 'Lunes'
      break
    case 'Tue':
      day = 'Martes'
      break
    case 'Wed':
      day = 'Miercoles'
      break
    case 'Thu':
      day = 'Jueves'
      break
    case 'Fri':
      day = 'Viernes'
      break
    case 'Sat':
      day = 'Sábado'
      break
    case 'Sun':
      day = 'Domingo'
      break
  }
  switch (date.slice(4, 7)) {
    case 'Jan':
      month = 'Enero'
      break
    case 'Feb':
      month = 'Febrero'
      break
    case 'Mar':
      month = 'Marzo'
      break
    case 'Apr':
      month = 'Abril'
      break
    case 'May':
      month = 'Mayo'
      break
    case 'Jun':
      month = 'Junio'
      break
    case 'Jul':
      month = 'Julio'
      break
    case 'Aug':
      month = 'Agosto'
      break
    case 'Sep':
      month = 'Septiembre'
      break
    case 'Oct':
      month = 'Octubre'
      break
    case 'Nov':
      month = 'Noviembre'
      break
    case 'Dec':
      month = 'Diciembre'
      break
  }
  return `${day} ${number} de ${month}`
}
// this is the bread and butter, we take the data from the local storage and we add it to the popup.
const addWeather = () => {
  const storage = browser.storage.local.get()
  storage.then(data => {
    console.log(data)
    
    // const description = getWeatherImg(data.description)
    // const fecha = translateDate(data.date)
    changeText(city, data.city)
    changeText(date, translateDate(data.date))
    changeText(weather, getWeather(data.weather))
    changeText(imageweather, `<img src="images/assets/${getWeatherImg(data.description)}.png" width="250" />`)
    changeText(temperature, `${Number.parseInt(data.temperature)}°`)
    changeText(humidity, `${data.humidity}%`)
  }).catch(error => console.log(error))
}

addWeather()
