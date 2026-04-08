export const WEAPON_MAP = {
  E: 'Шпага',
  S: 'Сабля',
  F: 'Рапира',
} as const;

export const AGE_MAP = {
  K: 'Кадеты',
  C: 'Дети',
  J: 'Юниоры',
  U23: 'До 23 лет',
  A: 'Взрослые',
  V: 'Ветераны',
} as const;

export const GENDER_MAP = {
  M: 'М',
  F: 'Ж',
} as const;


export type WeaponCode = keyof typeof WEAPON_MAP;
export type AgeCode = keyof typeof AGE_MAP;
export type GenderCode = keyof typeof GENDER_MAP;


const reverse = (obj: Record<string, string>) => 
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

export const WeaponReverseMap = reverse(WEAPON_MAP) as Record<string, WeaponCode>;
export const AgeReverseMap = reverse(AGE_MAP) as Record<string, AgeCode>;

export interface EventPlace {
  region: string;
  venue: string;
  address: string;
}

export interface CompetitionEvent {
  event_id: string;
  event_name?: string;
  category?: boolean;
  type?: "T" | "I";
  start?: string;
  finish?: string;
  serie?: string[];
  org_user_id?: string;
  weapon?: WeaponCode;
  gender?: GenderCode;
  age?: AgeCode;
  status?: string;
  is_international?: boolean;
  event_place?: EventPlace;
  payment?: string[];
}

export interface DisplayEvent {
  id: string;
  date: string;
  region: string;
  title: string;
  gender: typeof GENDER_MAP[GenderCode];
  weapon: string;
  category: string;
  type: 'Личные' | 'Командные';
  rawEvent: CompetitionEvent;
}


export interface EventFilters {
  gender?: string; 
  weapon?: string;
  age?: string;
  serie?: string[];
  from?: string;
  to?: string;
  eventName?: string;
  eventId?: string;
  orgUserId?: string;
}


export interface FilterState extends Required<Omit<EventFilters, 'from' | 'to' | 'event_name'>> {
  dateFrom: string;
  dateTo: string;
  eventName: string;
  region: string;
  payment: string;
  gender: string;
  weapon: string;
  age: string;
  category?: boolean;
  type?: string;
}

