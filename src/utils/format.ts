import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatTime = (timestamp: number) => {
  return format(new Date(timestamp * 1000), 'HH:mm');
};

export const formatDay = (timestamp: number) => {
  return format(new Date(timestamp * 1000), 'EEEE', { locale: zhCN });
};
