/* eslint-disable promise/no-nesting */
import browser from 'webextension-polyfill'


const submit = document.getElementById('submit')
const select = document.getElementById('country')
const city = document.getElementById('userinput')

const post = () => {
  if (city.value.length > 0) {
    const name = select.selectedIndex
    const request = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value},${select.options.item(name).value}&appid=15d7968a4ea50d6b568a07a54e399358`)
    console.log(`https://api.openweathermap.org/data/2.5/weather?q=${city.value},${select.options.item(name).value}&appid=15d7968a4ea50d6b568a07a54e399358`)
    request.then(response => {
      if (response.status === 200) {
        const date = new Date()
        console.log('Valid combination')
        response.json()
          .then(data => {
            const temperature = parseFloat((data.main.temp - 273).toFixed(2))
            const minimumTemp = parseFloat((data.main.temp_min - 273).toFixed(2))
            const maximumTemp = parseFloat((data.main.temp_max - 273).toFixed(2))
            const feelsTemp = parseFloat((data.main.feels_like - 273).toFixed(2))
            console.log('date', date)
            browser.storage.local.set({
              country: select.options.item(name).value,
              city: city.value,
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
        alert('the extension has been fully initialized')
        // setTimeout(() => browser.runtime.sendMessage({
        //   message: 'close',
        // }), 1000)
      }
    }).catch(error => console.log('it seems that something went wrong', error))
  }
}




submit.addEventListener('click', post)

city.addEventListener('keypress', (event) => {
  if (event.which === 13) {
    post()
  }
}
)

// 15d7968a4ea50d6b568a07a54e399358
