import './style.css'
import { displayLocation, displayWeather, getCurrentWeather, getLocation, setTempUnit } from './utilities';

const locationForm = document.getElementById("location-form") as HTMLFormElement;
const tempUnitForm = document.getElementById("temp-unit-form") as HTMLFormElement;

window.onload = function() {
  tempUnitForm.reset();
}

locationForm.addEventListener('submit', event => {
  event.preventDefault();

  const locationInput = document.getElementById("location") as HTMLInputElement;
  const locationName = locationInput.value;

  getLocation(locationName)
    .then(response => {
      if (response.results) {
        const location = response.results[0];
        displayLocation(location);
        return getCurrentWeather(location);
      } else {
        throw new Error("Location not found");
      }
    })
    .then(weather => {
      displayWeather(weather);
    })
    .catch(error => {
      console.log("Error getting data");
      console.log(error);
    })

  locationInput.value = "";
})

tempUnitForm.addEventListener('change', event => {
  let target = event.target as Element;
  let tempUnit = target.id;
  
  setTempUnit(tempUnit);
})
