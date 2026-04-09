import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';

export const SearchBar: React.FC = () => {
  const [input, setInput] = useState('');
  const { fetchWeatherByCity, fetchWeatherByCoords, isLoading } = useWeatherStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      fetchWeatherByCity(input.trim());
      setInput('');
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('您的浏览器不支持地理位置功能');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        let msg = '无法获取位置信息';
        if (error.code === error.PERMISSION_DENIED) msg = '您拒绝了位置权限请求，请手动输入城市名称';
        alert(msg);
      }
    );
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-md mx-auto mb-8 gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="搜索城市 (如: 北京, 深圳)"
          className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={20} />
      </div>
      
      <button
        type="button"
        onClick={handleGeolocation}
        disabled={isLoading}
        className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/30 transition-colors disabled:opacity-50"
        title="获取当前位置天气"
      >
        {isLoading ? <Loader2 className="animate-spin" size={24} /> : <MapPin size={24} />}
      </button>
    </form>
  );
};
