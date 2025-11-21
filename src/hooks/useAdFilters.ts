// hooks/useAdFilters.ts
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

export const useAdFilters = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<string>('desc')

  const resetFilters = () => {
    setSelectedStatuses([])
    setSelectedCategory(undefined)
    setMinPrice('')
    setMaxPrice('')
    setSearchInput('')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

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
