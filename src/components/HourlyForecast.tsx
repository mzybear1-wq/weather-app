import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { formatTime } from '../utils/format';
import { Clock } from 'lucide-react';

export const HourlyForecast: React.FC = () => {
  const { forecast } = useWeatherStore();

  if (!forecast) return null;

  // Get next 8 items (24 hours)
  const hourlyData = forecast.list.slice(0, 8);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 mb-6 text-white w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4 text-white/80 text-sm font-medium border-b border-white/10 pb-3">
        <Clock size={16} />
        <span>每小时预报</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-between w-full">
        {hourlyData.map((item, index) => (
          <div key={item.dt} className="flex flex-col items-center min-w-[60px] gap-2 flex-shrink-0">
            <span className="text-sm font-medium">{index === 0 ? '现在' : formatTime(item.dt)}</span>
            <img 
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
              alt={item.weather[0].description}
              className="w-12 h-12 drop-shadow-md -my-1"
            />
            <span className="text-lg font-semibold">{Math.round(item.main.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
