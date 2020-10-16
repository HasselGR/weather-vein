/* eslint-disable promise/no-nesting */
import browser from 'webextension-polyfill'


let submit = document.getElementById('submit')
const select = document.getElementById('country')
const city = document.getElementById('userinput')

submit.addEventListener('click', function () {
  if (city.value.length > 0) {
    var name = select.selectedIndex
    let request = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value},${select.options.item(name).value}&appid=15d7968a4ea50d6b568a07a54e399358`)
    request.then(response => {
      if (response.status === 200) {
        console.log('Valid combination')
        response.json()
          .then(data => {
            browser.storage.local.set({
              country: select.options.item(name).value,
              city: city.value,
              weather: data.weather[0].main,
              icon: data.weather[0].icon,
              description: data.weather[0].description,
              temperature: data.main.temp,
              min_temperature: data.main.temp_min,
              max_temperature: data.main.temp_max,
              feel_temperature: data.main.feels_like,
              humidity: data.main.humidity,
            })
          })
        browser.runtime.sendMessage({
          message: 'close',
        })
        alert('the extension has been fully initialized')
      }
    }).catch(error => console.log('it seems that something went wrong', error))
  }
})

// 15d7968a4ea50d6b568a07a54e399358
