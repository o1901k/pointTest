import axios, { AxiosError } from "axios";
import { ERROR_MESSAGES, PaginatedResponse } from "./types";
import {
  CompetitionEvent,
  EventFilters,
  WeaponReverseMap,
  AgeReverseMap,
  DisplayEvent,
  GENDER_MAP,
  WEAPON_MAP,
  AGE_MAP,
} from "../types/competition";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  auth: {
    username: process.env.REACT_APP_API_USERNAME ?? "",
    password: process.env.REACT_APP_API_PASSWORD ?? "",
  },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status || error.code || "";
    const message = ERROR_MESSAGES[status] || error.response?.data?.message || "Ошибка API";
    return Promise.reject(new Error(message));
  },
);

const regionCache = new Map<string, Promise<string>>();


export const getEventRegion = (eventId: string): Promise<string> => {
  const cached = regionCache.get(eventId);
  if (cached) return cached;

  const regionPromise = (async () => {
    try {
      const participants = await fetchParticipants(eventId);
      const participantWithRegion = participants.find((p: { region?: string }) => p.region && p.region.trim() !== "");
      return participantWithRegion?.region || "Не указан";
    } catch (error) {
      console.error(`getEventRegion error for ${eventId}:`, error);
      return "Не указан";
    }
  })();

  regionCache.set(eventId, regionPromise);
  return regionPromise;
};


async function enrichEventsWithRegions(events: CompetitionEvent[]): Promise<CompetitionEvent[]> {
  const regions = await Promise.all(events.map(event => getEventRegion(event.event_id)));
  
  return events.map((event, index) => ({
    ...event,
    event_place: {
      region: regions[index] || event.event_place?.region || "Не указан",
      venue: event.event_place?.venue || "",
      address: event.event_place?.address || ""
    }
  }));
}

export const fetchEventsPaginated = async (
  filters: EventFilters,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse> => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
      )
    };

    if (filters.weapon && filters.weapon !== 'Любое') {
      params.weapon = WeaponReverseMap[filters.weapon as keyof typeof WeaponReverseMap];
    }
    if (filters.gender && filters.gender !== 'Любой') {
      params.gender = filters.gender === 'Мужской' ? 'M' : 'F';
    }
    if (filters.age && filters.age !== 'Любой') {
      params.age = AgeReverseMap[filters.age as keyof typeof AgeReverseMap];
    }
    if (filters.serie && filters.serie.length > 0 && !filters.serie.includes('Все')) {
      params.serie = filters.serie;
    }
    if (filters.eventName) {
      params.event_name = filters.eventName;
    }

    const { data: allEvents } = await api.get<CompetitionEvent[]>('/restapi/events', { params });

    const start = (page - 1) * limit;
    const paginatedData = allEvents.slice(start, start + limit);

    const eventsWithRegions = await enrichEventsWithRegions(paginatedData);

    return {
      data: eventsWithRegions,
      total: allEvents.length,
      page,
      limit,
      hasMore: (start + limit) < allEvents.length
    };
  } catch (error) {
    console.error('fetchEventsPaginated error:', error);
    throw error;
  }
};

export const fetchEventById = async (id: string): Promise<CompetitionEvent> => {
  const [event, region] = await Promise.all([
    api.get<CompetitionEvent>(`/restapi/events/${id}`).then(r => r.data),
    getEventRegion(id)
  ]);
  
  return {
    ...event,
    event_place: {
      ...event.event_place,
      region: region || event.event_place?.region || "Не указан",
      venue: event.event_place?.venue || "",
      address: event.event_place?.address || ""
    }
  };
};

export const transformToDisplayEvent = (event: CompetitionEvent): DisplayEvent => {
  const { event_id, start, event_place, event_name, gender, weapon, age, type } = event;

  return {
    id: event_id,
    date: start ? start.split(" ")[0] : "",
    region: event_place?.region || "Не указан",
    title: event_name || "",
    gender: (gender ? (GENDER_MAP[gender] || "М") : "М") as "М" | "Ж",
    weapon: (weapon ? WEAPON_MAP[weapon] : "") || (weapon ?? ""),
    category: (age ? AGE_MAP[age] : "") || (age ?? ""),
    type: type === "I" ? "Личные" : "Командные",
    rawEvent: event,
  };
};



export const fetchSeries = () => api.get<string[]>('/restapi/series').then(r => r.data).catch(() => []);

export const fetchParticipants = (eventId: string) => {
  if (!eventId) return Promise.reject('event_id is required');
  return api.get(`/restapi/events/${eventId}/participants`).then(r => r.data).catch(() => []);
};

export const fetchResults = (eventId: string, phase?: number) => {
  const url = phase && phase > 0 
    ? `/restapi/events/${eventId}/phases/${phase}/results` 
    : `/restapi/events/${eventId}/results`;
  return api.get(url).then(r => r.data).catch(() => []);
};

export const prefetchRegions = async (eventIds: string[]): Promise<void> => {
  const uniqueIds = [...new Set(eventIds)].filter(id => !regionCache.has(id));
  await Promise.all(uniqueIds.map(getEventRegion));
};

export const clearRegionCache = () => regionCache.clear();
