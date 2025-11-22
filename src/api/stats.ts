import apiClient from './client'
import { StatsSummary } from '@/types'

export const getStatsSummary = async (
  period: string = 'week',
  signal?: AbortSignal
): Promise<StatsSummary> => {
  const response = await apiClient.get(`/stats/summary?period=${period}`, { signal })
  return response.data
}

export const getActivityChart = async (period: string = 'week', signal?: AbortSignal) => {
  const response = await apiClient.get(`/stats/chart/activity?period=${period}`, { signal })
  return response.data
}

export const getDecisionsChart = async (period: string = 'week', signal?: AbortSignal) => {
  const response = await apiClient.get(`/stats/chart/decisions?period=${period}`, { signal })
  return response.data
}

export const getCategoriesChart = async (period: string = 'week', signal?: AbortSignal) => {
  const response = await apiClient.get(`/stats/chart/categories?period=${period}`, { signal })
  return response.data
}
