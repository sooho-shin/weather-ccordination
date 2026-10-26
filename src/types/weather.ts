export type WeatherState = 'Clear' | 'Clouds' | 'Rain' | 'Snow';

export type TemperatureBandId =
  | 'over28'
  | '23to27'
  | '20to22'
  | '17to19'
  | '12to16'
  | '9to11'
  | '5to8'
  | 'under4';

export type Gender = 'female' | 'male' | 'all';

export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

export interface WeatherData {
  temperature: number;
  tempMax?: number;
  tempMin?: number;
  apparentKeyword?: string;
  weatherStateKeyword?: string;
  weatherState: WeatherState;
  weatherDescription: string;
  precipitation: number;
  locationName: string;
  isSimulated?: boolean;
}

export interface TemperatureBandInfo {
  id: TemperatureBandId;
  minTemp: number;
  maxTemp: number;
  label: string;
  summary: string;
  recommendedKeywords: string[];
}
