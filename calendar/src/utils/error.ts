import axios from 'axios';
import { ERROR_MESSAGES } from '../services/types';

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const key = err.code || err.response?.status || '';
    
    return (
      ERROR_MESSAGES[key] || 
      err.response?.data?.message || 
      'Ошибка сервера'
    );
  }

  if (err instanceof Error) {
    return err.message;
  }

  return 'Неизвестная ошибка';
};
