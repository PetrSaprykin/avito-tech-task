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

export const useUrlFilters = (props: UseUrlFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

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
  }, [])

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

    if (props.sortBy && props.sortBy !== 'createdAt') {
      params.set('sortBy', props.sortBy)
    }

    if (props.sortOrder && props.sortOrder !== 'desc') {
      params.set('order', props.sortOrder)
    }

    if (props.currentPage > 1) {
      params.set('page', props.currentPage.toString())
    }

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
