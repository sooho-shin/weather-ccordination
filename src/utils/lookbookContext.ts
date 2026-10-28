import { OutfitLookbook, TpoCategory } from '../types/outfit';
import { Gender, WeatherData } from '../types/weather';
import { getTemperatureBand } from '../constants/temperatureBands';

export function matchesLookbookWeather(lookbook: OutfitLookbook, weather: WeatherData) {
  return lookbook.tempBand === getTemperatureBand(weather.temperature).id && lookbook.weatherState === weather.weatherState;
}

export function matchesLookbookContext(lookbook: OutfitLookbook, weather: WeatherData, gender: Gender, tpo: TpoCategory) {
  return (gender === 'all' || lookbook.gender === gender) &&
    (!lookbook.tpo || lookbook.tpo === tpo) &&
    matchesLookbookWeather(lookbook, weather);
}
