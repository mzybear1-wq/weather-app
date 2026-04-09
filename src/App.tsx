import React, { useEffect } from 'react';
import { useWeatherStore } from './store/useWeatherStore';
import { SearchBar } from './components/SearchBar';
import { Favorites } from './components/Favorites';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherDetails } from './components/WeatherDetails';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const { currentWeather, isLoading, error, clearError } = useWeatherStore();

  // Dynamic background based on weather condition
  const getBgClass = () => {
    if (!currentWeather) return 'from-blue-400 to-blue-600'; // default clear blue
    const id = currentWeather.weather[0].id;
    if (id >= 200 && id < 600) return 'from-gray-700 to-gray-900'; // rain/drizzle/thunderstorm
    if (id >= 600 && id < 700) return 'from-blue-200 to-blue-400'; // snow
    if (id >= 700 && id < 800) return 'from-gray-400 to-gray-600'; // atmosphere (fog, mist)
    if (id === 800) return 'from-blue-400 to-blue-600'; // clear
    if (id > 800) return 'from-blue-300 to-gray-500'; // clouds
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className={clsx(
      "min-h-screen bg-gradient-to-b transition-colors duration-1000 p-4 sm:p-8 flex justify-center font-sans text-white overflow-hidden",
      getBgClass()
    )}>
      <div className="w-full max-w-md flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)]">
        
        {/* Error Toast */}
        {error && (
          <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl mb-4 flex justify-between items-center shadow-lg animate-fade-in z-50 absolute top-4 left-4 right-4 max-w-md mx-auto">
            <span className="font-medium text-sm">{error}</span>
            <button onClick={clearError} className="font-bold px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition">&times;</button>
          </div>
        )}

        <div className="shrink-0 pt-2">
          <SearchBar />
          <Favorites />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-white/80 min-h-[50vh]">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p className="font-medium">正在获取天气数据...</p>
            </div>
          ) : currentWeather ? (
            <div className="animate-fade-in">
              <CurrentWeather />
              <HourlyForecast />
              <DailyForecast />
              <WeatherDetails />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60 min-h-[50vh] text-center px-8">
              <div className="text-7xl mb-6 drop-shadow-md">🌍</div>
              <p className="text-lg font-medium text-white/80 mb-2">欢迎使用天气查询</p>
              <p className="text-sm">允许定位以查看当地天气，或使用上方搜索框查询。</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
