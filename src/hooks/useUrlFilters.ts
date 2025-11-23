import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface UseUrlFiltersProps {
  selectedStatuses: string[]
  setSelectedStatuses: (statuses: string[]) => void
  selectedCategory?: number
  setSelectedCategory: (category?: number) => void
  minPrice: string
  setMinPrice: (price: string) => void
  maxPrice: string
  setMaxPrice: (price: string) => void
  searchInput: string
  setSearchInput: (search: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: string
  setSortOrder: (order: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

/**
 * Хук для синхронизации фильтров с URL-параметрами.
 * Позволяет сохранять состояние фильтров при обновлении страницы и делиться ссылками.
 *
 * Работает в два этапа:
 * 1. При монтировании - восстанавливает фильтры из URL
 * 2. При изменении фильтров - обновляет URL
 *
 * @param props - Состояние фильтров и функции для их изменения
 *
 * @example
 * useUrlFilters({
 *   selectedStatuses,
 *   setSelectedStatuses,
 *   currentPage,
 *   setCurrentPage,
 *   ...
 * })
 * // URL будет выглядеть вот так: ?status=pending,approved&page=2&sortBy=price
 */
export const useUrlFilters = (props: UseUrlFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Первый useEffect: восстановление фильтров из URL при загрузке страницы
  useEffect(() => {
    const status = searchParams.get('status')
    if (status) {
      props.setSelectedStatuses(status.split(','))
    }

    const category = searchParams.get('category')
    if (category) {
      props.setSelectedCategory(parseInt(category))
    }

    const min = searchParams.get('minPrice')
    if (min) {
      props.setMinPrice(min)
    }

    const max = searchParams.get('maxPrice')
    if (max) {
      props.setMaxPrice(max)
    }

    const search = searchParams.get('search')
    if (search) {
      props.setSearchInput(search)
    }

    const sort = searchParams.get('sortBy')
    if (sort) {
      props.setSortBy(sort)
    }

    const order = searchParams.get('order')
    if (order) {
      props.setSortOrder(order)
    }

    const page = searchParams.get('page')
    if (page) {
      props.setCurrentPage(parseInt(page))
    }
    // Пустой массив зависимостей т.к. это выполняем только при монтировании
  }, [])

  // Второй useEffect нужен для синхронизация URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams()

    if (props.selectedStatuses.length > 0) {
      params.set('status', props.selectedStatuses.join(','))
    }

    if (props.selectedCategory && props.selectedCategory !== 0) {
      params.set('category', props.selectedCategory.toString())
    }

    if (props.minPrice) {
      params.set('minPrice', props.minPrice)
    }

    if (props.maxPrice) {
      params.set('maxPrice', props.maxPrice)
    }

    if (props.searchInput) {
      params.set('search', props.searchInput)
    }

    // Добавляем в URL только если отличается от дефолтного значения
    if (props.sortBy && props.sortBy !== 'createdAt') {
      params.set('sortBy', props.sortBy)
    }

    if (props.sortOrder && props.sortOrder !== 'desc') {
      params.set('order', props.sortOrder)
    }

    if (props.currentPage > 1) {
      params.set('page', props.currentPage.toString())
    }

    // replace: true - не создаём новую запись в истории браузера
    setSearchParams(params, { replace: true })
  }, [
    props.selectedStatuses,
    props.selectedCategory,
    props.minPrice,
    props.maxPrice,
    props.searchInput,
    props.sortBy,
    props.sortOrder,
    props.currentPage,
    setSearchParams,
  ])
}
