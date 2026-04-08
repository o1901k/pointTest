import { DisplayEvent } from "../../types/competition";

export interface CalendarListProps {
  competitions: DisplayEvent[];
  showAge?: boolean;
  showType?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const COLS_COUNT = 6;

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
