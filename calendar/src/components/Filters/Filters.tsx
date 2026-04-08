import React from "react";
import { FilterState } from "../../types/competition";
import { selectConfigs, inputConfig } from "./utils";
import styles from "./Filters.module.css";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onReset: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className={styles.filters}>
      <div className={styles.filterRow}>
        {selectConfigs.map(({ key, label, options }) => (
          <div key={key} className={styles.filterGroup}>
            <div className={styles.selectWrapper}>
              <select
                value={String(filters[key] ?? options[0].v)}
                onChange={(e) => onFilterChange(key, e.target.value)}
              >
                {options.map((opt) => (
                  <option key={opt.v} value={opt.v}>
                    {opt.t}
                  </option>
                ))}
              </select>
              <label className={styles.floatingLabel}>{label}</label>
            </div>
          </div>
        ))}

        {inputConfig.map((input) => (
          <div key={input.key} className={styles.filterGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={input.type}
                placeholder={input.ph}
                value={String(filters[input.key as keyof FilterState] ?? "")}
                onChange={(e) =>
                  onFilterChange(input.key as keyof FilterState, e.target.value)
                }
                className={styles.customInput}
                required
              />
              {input.label && (
                <label className={input.class}>{input.label}</label>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.filterRowSearch}>
        <input
          type="text"
          placeholder="Название"
          value={filters.eventName || ""}
          onChange={(e) => onFilterChange("eventName", e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.resetButton} onClick={onReset}>
          × Сбросить фильтр
        </button>
      </div>
    </div>
  );
};

export default Filters;
