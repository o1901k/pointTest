import React, { useMemo } from "react";
import { DisplayEvent } from "../../types/competition";
import { CalendarListProps, COLS_COUNT, formatDate } from "./utils";
import ScrollObserver from "../InfiniteScroll/ScrollObserver";
import styles from "./CalendarList.module.css";

const CalendarList: React.FC<CalendarListProps> = ({
  competitions,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
}) => {
  const sortedGroupedEntries = useMemo(() => {
    if (!competitions.length) return [];

    const groups = competitions.reduce(
      (acc, comp) => {
        if (!acc[comp.date]) acc[comp.date] = [];
        acc[comp.date].push(comp);
        return acc;
      },
      {} as Record<string, DisplayEvent[]>,
    );

    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime(),
    );
  }, [competitions]);

  if (competitions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Соревнования не найдены</p>
        <p className={styles.emptyHint}>
          Попробуйте изменить параметры фильтрации
        </p>
      </div>
    );
  }

  return (
    <div className={styles.calendarList}>
      <table className={styles.competitionTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Регион</th>
            <th>Название</th>
            <th>Пол</th>
            <th>Оружие</th>
            <th>Возраст или год рождения</th>
            <th>Тип</th>
          </tr>
        </thead>
        <tbody>
          {sortedGroupedEntries.map(([date, events]) => (
            <React.Fragment key={date}>
              <tr className={styles.dateGroupRow}>
                <td colSpan={COLS_COUNT} className={styles.dateGroupCell}>
                  <span className={styles.dateText}>{formatDate(date)}</span>
                </td>
              </tr>
              {events.map((comp) => (
                <tr key={comp.id} className={styles.competitionRow}>
                  <td className={styles.regionCell}>{comp.region}</td>
                  <td className={styles.titleCell}>{comp.title}</td>
                  <td className={styles.genderCell}>{comp.gender}</td>
                  <td className={styles.weaponCell}>{comp.weapon}</td>
                  <td className={styles.categoryCell}>{comp.category}</td>
                  <td className={styles.typeCell}>{comp.type}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {onLoadMore && (
        <ScrollObserver
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
        />
      )}
    </div>
  );
};

export default CalendarList;
