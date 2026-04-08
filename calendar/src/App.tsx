import React, { useState, useCallback, useMemo } from "react";
import { FilterState } from "./types/competition";
import { useInfiniteScrollPaginated } from "./hooks/useInfiniteScrollPaginated";
import { Filters, CalendarList, LoadingState, ErrorState } from "./components";
import styles from "./App.module.css";
import logo from "./assets/logo.png";
import accountCircle from "./assets/accountCircle.png";

const INITIAL_FILTERS: FilterState = {
  region: "Все",
  weapon: "Любое",
  gender: "Любой",
  age: "Любой",
  payment: "Любое",
  serie: [""],
  dateFrom: "",
  dateTo: "",
  eventName: "",
  eventId: "",
  orgUserId: "",
  category: undefined,
  type: "",
};

function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [showList, setShowList] = useState(true);

  const { events, loading, loadingMore, error, hasMore, loadNextPage } =
    useInfiniteScrollPaginated({ filters, limit: 15 });

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const toggleShowList = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShowList(e.target.checked);
    },
    [],
  );

  const headerLinks = useMemo(
    () => [
      { label: "Календарь", href: "/", isActive: true },
      { label: "Результаты", href: "/" },
      { label: "Рейтинги", href: "/" },
      { label: "FencingOne", href: "/" },
    ],
    [],
  );

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <img src={logo} alt="logo" />
          <nav className={styles.headerLinks}>
            {headerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.isActive ? styles.activeLink : styles.headerLink
                }
              >
                {link.label}
              </a>
            ))}
          </nav>
          <img src={accountCircle} alt="account" />
        </header>

        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        <div className={styles.toggleWrapper}>
          <span className={styles.toggleLabel}>Показывать списком</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={showList}
              onChange={toggleShowList}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {loading && <LoadingState />}
        {error && (
          <ErrorState
            message={error}
            onRetry={() => window.location.reload()}
          />
        )}

        {!loading && !error && showList && (
          <CalendarList
            competitions={events}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadNextPage}
          />
        )}

        {!loading && !error && !showList && (
          <div className={styles.hiddenMessage}>
            <p>
              Список скрыт. Включите "Показывать список" для отображения
              соревнований.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
