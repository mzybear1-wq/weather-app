import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { Wind, Droplets, Eye, Thermometer, Sunset, Sun } from 'lucide-react';
import { formatTime } from '../utils/format';

export const WeatherDetails: React.FC = () => {
  const { currentWeather } = useWeatherStore();

  if (!currentWeather) return null;

  // Mock UV index since free API doesn't provide it
  const mockUv = Math.floor(Math.random() * 8) + 1;
  const uvDesc = mockUv <= 3 ? '低' : mockUv <= 6 ? '中等' : '高';

  const details = [
    {
      icon: <Sun size={16} className="text-white/60" />,
      label: '紫外线',
      value: mockUv.toString(),
      desc: uvDesc
    },
    {
      icon: <Sunset size={16} className="text-white/60" />,
      label: '日落',
      value: formatTime(currentWeather.sys.sunset),
      desc: `日出 ${formatTime(currentWeather.sys.sunrise)}`
    },
    {
      icon: <Wind size={16} className="text-white/60" />,
      label: '风力',
      value: `${currentWeather.wind.speed} m/s`,
      desc: `风向 ${currentWeather.wind.deg}°`
    },
    {
      icon: <Droplets size={16} className="text-white/60" />,
      label: '湿度',
      value: `${currentWeather.main.humidity}%`,
      desc: `露点 ${Math.round(currentWeather.main.temp - ((100 - currentWeather.main.humidity) / 5))}°` // Approximation
    },
    {
      icon: <Eye size={16} className="text-white/60" />,
      label: '能见度',
      value: `${(currentWeather.visibility / 1000).toFixed(0)} km`,
      desc: currentWeather.visibility >= 10000 ? '视野良好' : '能见度一般'
    },
    {
      icon: <Thermometer size={16} className="text-white/60" />,
      label: '体感温度',
      value: `${Math.round(currentWeather.main.feels_like)}°`,
      desc: Math.abs(currentWeather.main.feels_like - currentWeather.main.temp) < 2 ? '与实际相符' : '较舒适'
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto mb-10">
      <div className="flex items-center gap-2 mb-4 text-white font-medium pl-1">
        <span>详细数据</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {details.map((item, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 text-white flex flex-col justify-between aspect-[4/3] shadow-sm">
            <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
              {item.icon}
              {item.label}
            </div>
            <div className="mt-auto">
              <div className="text-2xl font-semibold mb-1 tracking-tight">{item.value}</div>
              <div className="text-xs text-white/60 truncate">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
