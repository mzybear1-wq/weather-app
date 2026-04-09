import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getCurrentWeatherByCoords, 
  getForecastByCoords,
  getCoordinatesByCity
} from '../api/weather';
import type { CurrentWeatherResponse, ForecastResponse } from '../api/types';

interface WeatherState {
  // State
  currentWeather: CurrentWeatherResponse | null;
  forecast: ForecastResponse | null;
  isLoading: boolean;
  error: string | null;
  favorites: string[];

  // Actions
  fetchWeatherByCity: (city: string) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentWeather: null,
      forecast: null,
      isLoading: false,
      error: null,
      favorites: [], // Will be persisted to localStorage

      fetchWeatherByCity: async (city: string) => {
        set({ isLoading: true, error: null });
        try {
          // OpenWeatherMap's standard /weather?q= API struggles with Chinese city names.
          // The recommended approach is to use the Geocoding API first to get coordinates,
          // then fetch weather by coordinates.
          const coords = await getCoordinatesByCity(city);
          
          const [weatherData, forecastData] = await Promise.all([
            getCurrentWeatherByCoords(coords.lat, coords.lon),
            getForecastByCoords(coords.lat, coords.lon),
          ]);
          
          // Override the returned name with the proper localized name if available
          weatherData.name = coords.name || weatherData.name;
          
          set({ 
            currentWeather: weatherData, 
            forecast: forecastData, 
            isLoading: false 
          });
        } catch (error: any) {
          const errorMessage = error.response?.status === 404 || error.message === 'City not found'
            ? `找不到城市 "${city}"，请检查拼写或尝试输入拼音` 
            : '获取天气数据失败，请检查网络或API Key';
          
          set({ 
            error: errorMessage, 
            isLoading: false,
          });
        }
      },

      fetchWeatherByCoords: async (lat: number, lon: number) => {
        set({ isLoading: true, error: null });
        try {
          const [weatherData, forecastData] = await Promise.all([
            getCurrentWeatherByCoords(lat, lon),
            getForecastByCoords(lat, lon),
          ]);
          
          set({ 
            currentWeather: weatherData, 
            forecast: forecastData, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: '根据定位获取天气失败', 
            isLoading: false 
          });
        }
      },

      addFavorite: (city: string) => {
        const { favorites } = get();
        if (!favorites.includes(city)) {
          set({ favorites: [...favorites, city] });
        }
      },

      removeFavorite: (city: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((c) => c !== city) });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'weather-favorites-storage', // key in localStorage
      // Only persist the favorites array, we don't want to cache old weather data
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
