import { FilterState, EventFilters } from '../types/competition';


export interface UseInfiniteScrollPaginatedProps {
  filters: FilterState;
  limit?: number;
}

export const mapFiltersToApi = (f: FilterState): EventFilters => ({
  gender: f.gender && f.gender !== 'Любой' ? (f.gender === 'М' ? 'M' : 'F') : undefined,
  weapon: f.weapon !== 'Любое' ? f.weapon : undefined,
  age: f.age !== 'Любой' ? f.age : undefined,
  serie: (f.serie?.length && !f.serie.includes('Все')) ? f.serie : undefined,
  from: f.dateFrom || undefined,
  to: f.dateTo || undefined,
  eventName: f.eventName || undefined,
  eventId: f.eventId || undefined,
  orgUserId: f.orgUserId || undefined,
});
