import axios from 'axios';
import type { CurrentWeatherResponse, ForecastResponse } from './types';

// Read API configurations from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric', // Return temperature in Celsius
    lang: 'zh_cn',   // Return descriptions in Chinese
  },
});

export const getCoordinatesByCity = async (city: string) => {
  // OpenWeatherMap Geo API is at a different base path
  const geoUrl = BASE_URL.replace('/data/2.5', '/geo/1.0/direct');
  const response = await axios.get(geoUrl, {
    params: {
      q: city,
      limit: 1,
      appid: API_KEY,
    }
  });
  
  if (response.data && response.data.length > 0) {
    return {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
      name: response.data[0].local_names?.zh || response.data[0].name
    };
  }
  throw new Error('City not found');
};

/**
 * Fetch current weather data by city name
 */
export const getCurrentWeather = async (city: string): Promise<CurrentWeatherResponse> => {
  const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
    params: { q: city },
  });
  return response.data;
};

/**
 * Fetch current weather data by geographic coordinates
 */
export const getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<CurrentWeatherResponse> => {
  const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
    params: { lat, lon },
  });
  return response.data;
};

/**
 * Fetch 5-day / 3-hour forecast data by city name
 */
export const getForecast = async (city: string): Promise<ForecastResponse> => {
  const response = await apiClient.get<ForecastResponse>('/forecast', {
    params: { q: city },
  });
  return response.data;
};

/**
 * Fetch 5-day / 3-hour forecast data by geographic coordinates
 */
export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastResponse> => {
  const response = await apiClient.get<ForecastResponse>('/forecast', {
    params: { lat, lon },
  });
  return response.data;
};
