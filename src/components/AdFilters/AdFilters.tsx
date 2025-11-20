import { Input, Select, Button, Space } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./AdFilters.module.css";

interface AdFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
  selectedCategory?: number;
  onCategoryChange: (category?: number) => void;
  minPrice: string;
  onMinPriceChange: (price: string) => void;
  maxPrice: string;
  onMaxPriceChange: (price: string) => void;
  onResetFilters: () => void;
  searchInputRef?: React.RefObject<any>;
}

const STATUS_OPTIONS = [
  { label: "На модерации", value: "pending" },
  { label: "Одобрено", value: "approved" },
  { label: "Отклонено", value: "rejected" },
  { label: "Черновик", value: "draft" },
];

const CATEGORY_OPTIONS = [
  { label: "Все категории", value: 0 },
  { label: "Недвижимость", value: 1 },
  { label: "Транспорт", value: 2 },
  { label: "Работа", value: 3 },
  { label: "Услуги", value: 4 },
  { label: "Животные", value: 5 },
];

export const AdFilters = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedStatuses,
  onStatusesChange,
  selectedCategory,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  onResetFilters,
  searchInputRef,
}: AdFiltersProps) => {
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <div className={styles.filtersSection}>
      <div className={styles.searchBar}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            ref={searchInputRef}
            placeholder="Поиск по названию или описанию (нажмите / для быстрого доступа)"
            allowClear
            size="large"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyUp={handleSearchKeyPress}
          />
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={onSearchSubmit}
          >
            Поиск
          </Button>
        </Space.Compact>
      </div>

      <div className={styles.filtersRow}>
        <div className={styles.filterItem}>
          <label>Статус:</label>
          <Select
            mode="multiple"
            placeholder="Выберите статусы"
            value={selectedStatuses}
            onChange={onStatusesChange}
            options={STATUS_OPTIONS}
            style={{ width: "100%", marginTop: 8 }}
          />
        </div>

        <div className={styles.filterItem}>
          <label>Категория:</label>
          <Select
            placeholder="Выберите категорию"
            value={selectedCategory}
            onChange={onCategoryChange}
            options={CATEGORY_OPTIONS}
            style={{ width: "100%", marginTop: 8 }}
          />
        </div>

        <div className={styles.filterItem}>
          <label>Цена от:</label>
          <Input
            type="number"
            placeholder="Минимальная цена"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>

        <div className={styles.filterItem}>
          <label>Цена до:</label>
          <Input
            type="number"
            placeholder="Максимальная цена"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>
      </div>

      <div className={styles.filtersActions}>
        <Button icon={<ReloadOutlined />} onClick={onResetFilters}>
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
};
