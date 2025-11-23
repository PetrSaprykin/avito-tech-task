import { renderHook, act } from '@testing-library/react'
import { useAdFilters } from '@/hooks/useAdFilters'
import { describe, it, expect } from 'vitest'

describe('useAdFilters', () => {
  describe('getFilterParams', () => {
    it('должен игнорировать поиск если меньше 3 символов', () => {
      const { result } = renderHook(() => useAdFilters())

      const params = result.current.getFilterParams('ab')

      expect(params.search).toBeUndefined()
    })

    it('должен добавить поиск если 3 и более символов', () => {
      const { result } = renderHook(() => useAdFilters())

      const params = result.current.getFilterParams('abc')

      expect(params.search).toBe('abc')
    })

    it('должен включать только заполненные фильтры', () => {
      const { result } = renderHook(() => useAdFilters())

      const params = result.current.getFilterParams('')

      // Только сортировка по умолчанию, остальные фильтры пустые
      expect(params.sortBy).toBe('createdAt')
      expect(params.sortOrder).toBe('desc')
      expect(params.status).toBeUndefined()
      expect(params.categoryId).toBeUndefined()
      expect(params.minPrice).toBeUndefined()
      expect(params.maxPrice).toBeUndefined()
    })

    it('должен включать статусы если они выбраны', () => {
      const { result } = renderHook(() => useAdFilters())

      act(() => {
        result.current.setSelectedStatuses(['pending', 'approved'])
      })

      const params = result.current.getFilterParams('')

      expect(params.status).toEqual(['pending', 'approved'])
    })

    it('должен парсить цены из строк в числа', () => {
      const { result } = renderHook(() => useAdFilters())

      act(() => {
        result.current.setMinPrice('1000')
        result.current.setMaxPrice('5000')
      })

      const params = result.current.getFilterParams('')

      expect(params.minPrice).toBe(1000)
      expect(params.maxPrice).toBe(5000)
    })

    it('должен включать все фильтры когда они заполнены', () => {
      const { result } = renderHook(() => useAdFilters())

      act(() => {
        result.current.setSelectedStatuses(['pending'])
        result.current.setSelectedCategory(5)
        result.current.setMinPrice('500')
        result.current.setMaxPrice('10000')
        result.current.setSortBy('price')
        result.current.setSortOrder('asc')
      })

      const params = result.current.getFilterParams('недвижимость')

      expect(params).toEqual({
        status: ['pending'],
        categoryId: 5,
        minPrice: 500,
        maxPrice: 10000,
        search: 'недвижимость',
        sortBy: 'price',
        sortOrder: 'asc',
      })
    })
  })

  describe('resetFilters', () => {
    it('должен сбросить все фильтры кроме сортировки', () => {
      const { result } = renderHook(() => useAdFilters())

      act(() => {
        result.current.setSelectedStatuses(['pending'])
        result.current.setSelectedCategory(5)
        result.current.setMinPrice('1000')
        result.current.setMaxPrice('5000')
        result.current.setSearchInput('тест')
      })

      act(() => {
        result.current.resetFilters()
      })

      expect(result.current.selectedStatuses).toEqual([])
      expect(result.current.selectedCategory).toBeUndefined()
      expect(result.current.minPrice).toBe('')
      expect(result.current.maxPrice).toBe('')
      expect(result.current.searchInput).toBe('')
      // Сортировка не должна сбрасываться
      expect(result.current.sortBy).toBe('createdAt')
      expect(result.current.sortOrder).toBe('desc')
    })
  })
})
