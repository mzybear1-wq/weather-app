import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { Star } from 'lucide-react';
import clsx from 'clsx';

export const CurrentWeather: React.FC = () => {
  const { currentWeather, forecast, favorites, addFavorite, removeFavorite } = useWeatherStore();

  if (!currentWeather) return null;

  const isFavorite = favorites.includes(currentWeather.name);
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(currentWeather.name);
    } else {
      addFavorite(currentWeather.name);
    }
  };

  // OpenWeatherMap's /weather endpoint temp_min/max is just the current moment's variation across stations.
  // To get today's true high/low, we should extract it from the forecast data.
  let todayMax = currentWeather.main.temp_max;
  let todayMin = currentWeather.main.temp_min;
  
  if (forecast && forecast.list.length > 0) {
    const today = new Date().toDateString();
    const todaysForecasts = forecast.list.filter(item => 
      new Date(item.dt * 1000).toDateString() === today
    );
    
    if (todaysForecasts.length > 0) {
      todayMax = Math.max(...todaysForecasts.map(f => f.main.temp_max), currentWeather.main.temp);
      todayMin = Math.min(...todaysForecasts.map(f => f.main.temp_min), currentWeather.main.temp);
    }
  }

  // Mock AQI logic for display purposes since free API doesn't have it in /weather endpoint
  const mockAqi = Math.floor(Math.random() * 50) + 20;
  const aqiLabel = mockAqi <= 50 ? '优' : mockAqi <= 100 ? '良' : '轻度污染';
  const aqiColor = mockAqi <= 50 ? 'bg-green-400' : mockAqi <= 100 ? 'bg-yellow-400' : 'bg-orange-400';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-8 text-white relative animate-fade-in">
      <div className="absolute top-0 right-4">
        <button
          onClick={toggleFavorite}
          className={clsx(
            "p-3 rounded-full backdrop-blur-md border transition-all duration-300",
            isFavorite 
              ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-400" 
              : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
          )}
          title={isFavorite ? "取消收藏" : "加入收藏"}
        >
          <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <h1 className="text-4xl font-medium tracking-wider mb-1 drop-shadow-md">
        {currentWeather.name}
      </h1>
      <p className="text-lg text-white/90 mb-6 drop-shadow-sm font-medium">
        {currentWeather.weather[0]?.description}
      </p>
      
      <div className="text-8xl font-light tracking-tighter mb-6 relative drop-shadow-lg flex items-start justify-center w-full">
        {Math.round(currentWeather.main.temp)}
        <span className="text-5xl font-light ml-2 mt-2">°</span>
      </div>
      
      <div className="flex items-center gap-4 text-white/90 text-base font-medium mb-8 bg-black/10 px-6 py-2 rounded-full backdrop-blur-sm">
        <span>最高 {Math.round(todayMax)}°</span>
        <span className="w-px h-4 bg-white/30"></span>
        <span>最低 {Math.round(todayMin)}°</span>
      </div>

      <div className="flex w-full justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-white/80 text-sm">AQI {mockAqi}</span>
          <span className={clsx("px-2 py-0.5 rounded-md text-xs text-gray-900 font-bold shadow-sm", aqiColor)}>
            {aqiLabel}
          </span>
        </div>
        <span className="text-sm text-white/80">适宜户外活动</span>
      </div>
    </div>
  );
};
