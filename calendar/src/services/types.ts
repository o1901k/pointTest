import {CompetitionEvent} from '../types/competition';

export const ERROR_MESSAGES: Record<string | number, string> = {
  401: 'Ошибка авторизации.',
  404: 'API endpoint не найден. Проверьте URL.',
  ECONNABORTED: 'Превышено время ожидания ответа.',
};

export interface PaginatedResponse {
  data: CompetitionEvent[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};
