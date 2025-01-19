import axios from "axios";
import { Location, LocationResponse, WeatherResponse } from "./types";

const weatherCodes = new Map([
    [0, "Clear Sky"], [1, "Mainly Clear"], [2, "Partly Cloudy"], [3, "Overcast"],
    [45, "Fog"], [48, "Depositing Rime Fog"], [51, "Light Drizzle"], [53, "Drizzle"],
    [55, "Heavy Drizzle"], [56, "Light Freezing Drizzle"], [57, "Heavy Freezing Drizzle"], [61, "Light Rain"],
    [63, "Rain"], [65, "Heavy Rain"], [66, "Light Freezing Rain"], [67, "Heavy Freezing Rain"],
    [71, "Light Snow"], [73, "Snow"], [75, "Heavy Snow"], [77, "Snow Grains"],
    [80, "Light Rain Showers"], [81, "Rain Showers"], [82, "Violent Rain Showers"], [85, "Light Snow Showers"],
    [86, "Heavy Snow Showers"], [95, "Thuderstorm"], [96, "Thunderstorm with Hail"], [99, "Thunderstorm with Heavy Hail"]
])

let tempUnitName = "fahrenheit";

export function getLocation(locationName: string): Promise<LocationResponse> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=1`;
    return axios.get(url).then(response => response.data);
}

export function getCurrentWeather(locationDetails: Location): Promise<WeatherResponse> {
    const latitude = locationDetails.latitude;
    const longitude = locationDetails.longitude;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=${tempUnitName}&models=icon_global`;
    return axios.get(url).then(response => response.data);
}

export function displayLocation(locationDetails: Location) {
    const city = locationDetails.name;
    const country = locationDetails.country;
    const locationName = document.getElementById("location-name") as HTMLElement;
    locationName.innerText = `${city}, ${country}`;
}

export function displayWeather(weatherDetails: WeatherResponse) {
    const temp = weatherDetails.current_weather.temperature;
    const tempUnit = weatherDetails.current_weather_units.temperature;
    const temperature = document.getElementById("temperature") as HTMLElement;
    temperature.innerText = `${Math.floor(temp)}${tempUnit}`;

    const weatherCode = weatherDetails.current_weather.weathercode;
    const weatherConditions = document.getElementById("weather-conditions") as HTMLElement;
    weatherConditions.innerText = `${weatherCodes.get(weatherCode)}`;
}

export function setTempUnit(selectedUnit: string) {
    let currTemp = document.getElementById("temperature") as HTMLElement;
    console.log(currTemp.innerText)
    tempUnitName = selectedUnit;
    if (currTemp.innerText) {
        let temp = Number(currTemp.innerText.replace(/[^-\d]/g, ""));
        switch (tempUnitName) {
            case "fahrenheit":
                temp = (9 / 5) * temp + 32;
                currTemp.innerText = `${Math.floor(temp)}${"°F"}`
                break;
            case "celsius":
                temp = (temp - 32) * (5 / 9);
                currTemp.innerText = `${Math.floor(temp)}${"°C"}`
                break;
        }
    }
}