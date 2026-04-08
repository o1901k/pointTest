import styles from "./Filters.module.css";
import { FilterState } from "../../types/competition";

export const selectConfigs: {
  key: keyof FilterState;
  label: string;
  options: { v: string; t: string }[];
}[] = [
  {
    key: "region",
    label: "Регион",
    options: [
      { v: "Все", t: "Все" },
      { v: "СПБ", t: "Санкт-Петербург" },
      { v: "МОСКВА", t: "Москва" },
      { v: "МОО", t: "Московская область" },
      { v: "ЛО", t: "Ленинградская область" },
    ],
  },
  {
    key: "weapon",
    label: "Оружие",
    options: [
      { v: "Любое", t: "Любое" },
      { v: "Шпага", t: "Шпага" },
      { v: "Сабля", t: "Сабля" },
      { v: "Рапира", t: "Рапира" },
    ],
  },
  {
    key: "gender",
    label: "Пол",
    options: [
      { v: "Любой", t: "Любой" },
      { v: "M", t: "Мужской" },
      { v: "F", t: "Женский" },
    ],
  },
  {
    key: "age",
    label: "Возраст",
    options: [
      { v: "Любой", t: "Любой" },
      { v: "Кадеты", t: "Кадеты" },
      { v: "Дети", t: "Дети" },
      { v: "Юниоры", t: "Юниоры" },
      { v: "До 23 лет", t: "До 23 лет" },
      { v: "Взрослые", t: "Взрослые" },
    ],
  },
  {
    key: "payment",
    label: "Платно/бесплатно",
    options: [
      { v: "Любое", t: "Любое" },
      { v: "Бесплатно", t: "Бесплатно" },
      { v: "Платно", t: "Платно" },
    ],
  },
];

export const inputConfig = [
  {
    key: "serie",
    type: "text",
    label: "Серия",
    ph: "",
    class: styles.floatingLabelInput,
  },
  {
    key: "dateFrom",
    type: "date",
    label: "Дата с",
    ph: "",
    class: styles.floatingLabelInput,
  },
  {
    key: "dateTo",
    type: "date",
    label: "Дата по",
    ph: "",
    class: styles.floatingLabelInput,
  },
];
