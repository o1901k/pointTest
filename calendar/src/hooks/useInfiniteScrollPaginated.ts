import { useState, useEffect, useCallback, useRef } from "react";
import { DisplayEvent } from "../types/competition";
import { UseInfiniteScrollPaginatedProps, mapFiltersToApi } from "./utils";
import { fetchEventsPaginated, transformToDisplayEvent } from "../services/api";

export const useInfiniteScrollPaginated = ({
  filters,
  limit = 20,
}: UseInfiniteScrollPaginatedProps) => {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (targetPage: number, isFirstPage: boolean) => {
      try {
        if (isFirstPage) {
          setLoading(true);
          setError(null);
          abortControllerRef.current?.abort();
          abortControllerRef.current = new AbortController();
        } else {
          setLoadingMore(true);
        }

        const apiFilters = mapFiltersToApi(filters);
        const response = await fetchEventsPaginated(
          apiFilters,
          targetPage,
          limit,
        );

        let newEvents = response.data.map(transformToDisplayEvent);

        if (filters.region && filters.region !== "Все") {
          const regionLower = filters.region.toLowerCase();
          newEvents = newEvents.filter((e) =>
            e.region.toLowerCase().includes(regionLower),
          );
        }

        setEvents((prev) =>
          isFirstPage ? newEvents : [...prev, ...newEvents],
        );
        setTotalCount(response.total);
        setHasMore(response.hasMore);
        setPage(targetPage);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            setError(err.message || "Ошибка загрузки");
          }
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        if (isFirstPage) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [filters, limit],
  );

  useEffect(() => {
    fetchData(1, true);
    return () => abortControllerRef.current?.abort();
  }, [filters, fetchData]);

  const loadNextPage = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchData(page + 1, false);
    }
  }, [fetchData, page, hasMore, loadingMore]);

  return {
    events,
    loading,
    loadingMore,
    error,
    hasMore,
    loadNextPage,
    totalCount,
    page,
  };
};
