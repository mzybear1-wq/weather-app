import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { formatDay } from '../utils/format';
import { CalendarDays } from 'lucide-react';

export const DailyForecast: React.FC = () => {
  const { forecast } = useWeatherStore();

  if (!forecast) return null;

  // Group by day to find min/max
  const dailyData: Record<string, { min: number, max: number, icon: string, description: string, dt: number }> = {};
  
  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        dt: item.dt
      };
    } else {
      dailyData[date].min = Math.min(dailyData[date].min, item.main.temp_min);
      dailyData[date].max = Math.max(dailyData[date].max, item.main.temp_max);
    }
  });

  const days = Object.values(dailyData).slice(0, 5);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 mb-6 text-white w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4 text-white/80 text-sm font-medium border-b border-white/10 pb-3">
        <CalendarDays size={16} />
        <span>5天预报</span>
      </div>
      <div className="flex flex-col gap-4">
        {days.map((day, index) => (
          <div key={day.dt} className="flex items-center justify-between py-1">
            <span className="w-16 font-medium text-sm">{index === 0 ? '今天' : formatDay(day.dt)}</span>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                alt={day.description}
                className="w-8 h-8 drop-shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-32 justify-end font-medium text-sm">
              <span className="text-white/60 w-6 text-right">{Math.round(day.min)}°</span>
              <div className="w-12 h-1.5 rounded-full bg-white/20 overflow-hidden flex-shrink-0">
                <div className="h-full bg-gradient-to-r from-blue-300 to-yellow-400 rounded-full w-full"></div>
              </div>
              <span className="w-6 text-left">{Math.round(day.max)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
