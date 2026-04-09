import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';

export const Favorites: React.FC = () => {
  const { favorites, fetchWeatherByCity } = useWeatherStore();

  if (favorites.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-6 px-1">
      <h3 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-1.5">
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        收藏城市
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {favorites.map((city) => (
          <button
            key={city}
            onClick={() => fetchWeatherByCity(city)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white whitespace-nowrap transition text-sm font-medium"
          >
            <MapPin size={14} className="text-white/70" />
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
