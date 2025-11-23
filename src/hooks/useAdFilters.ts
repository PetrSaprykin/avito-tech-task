import { useState } from 'react'

export interface GetAdsParams {
  page?: number
  limit?: number
  status?: string[]
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: string
  sortOrder?: string
}

/**
 * Это Ххук для управления состоянием фильтров списка объявлений.
 * Централизует всю логику фильтрации, сортировки и поиска.
 *
 * @returns Состояние фильтров и методы для их управления
 *
 * @example
 * const {
 *   selectedStatuses,
 *   setSelectedStatuses,
 *   getFilterParams,
 *   resetFilters
 * } = useAdFilters()
 */
export const useAdFilters = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<string>('desc')

  /**
   * Сбрасывает все фильтры к начальным значениям.
   * Сортировка не сбрасывается.
   */
  const resetFilters = () => {
    setSelectedStatuses([])
    setSelectedCategory(undefined)
    setMinPrice('')
    setMaxPrice('')
    setSearchInput('')
  }

  /**
   * Формирует объект параметров для API запроса на основе текущих фильтров.
   * Включает только заполненные фильтры (игнорирует пустые значения).
   * Поиск активируется только если введено 3+ символа.
   *
   * @param searchQuery - Поисковый запрос
   * @returns Объект параметров для функции получения объявелений getAds
   */
  const getFilterParams = (searchQuery: string): Partial<GetAdsParams> => {
    const params: Partial<GetAdsParams> = {
      sortBy,
      sortOrder,
    }

    if (selectedStatuses.length > 0) {
      params.status = selectedStatuses
    }
    if (selectedCategory) {
      params.categoryId = selectedCategory
    }
    if (minPrice) {
      params.minPrice = parseFloat(minPrice)
    }
    if (maxPrice) {
      params.maxPrice = parseFloat(maxPrice)
    }
    // Минимум 3 символа для активации поиска
    if (searchQuery && searchQuery.length >= 3) {
      params.search = searchQuery
    }

    return params
  }

  return {
    selectedStatuses,
    setSelectedStatuses,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    searchInput,
    setSearchInput,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    getFilterParams,
  }
}
