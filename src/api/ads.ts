import apiClient from "./client";
import { Advertisement, Pagination } from "../types";
import { GetAdsParams } from "@/hooks/useAdFilters";

interface GetAdsResponse {
  ads: Advertisement[];
  pagination: Pagination;
}

// получение объявлений по параметрам
export const getAds = async (
  params: GetAdsParams = {}
): Promise<GetAdsResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.status && params.status.length > 0) {
    params.status.forEach((status) => queryParams.append("status", status));
  }
  if (params.categoryId)
    queryParams.append("categoryId", params.categoryId.toString());
  if (params.minPrice)
    queryParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice)
    queryParams.append("maxPrice", params.maxPrice.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  const response = await apiClient.get<GetAdsResponse>(
    `/ads?${queryParams.toString()}`
  );
  return response.data;
};

export const getAdById = async (id: number): Promise<Advertisement> => {
  const response = await apiClient.get<Advertisement>(`/ads/${id}`);
  return response.data;
};

export const approveAd = async (
  id: number
): Promise<{ message: string; ad: Advertisement }> => {
  const response = await apiClient.post(`/ads/${id}/approve`);
  return response.data;
};

export const rejectAd = async (
  id: number,
  reason: string,
  comment?: string
): Promise<{ message: string; ad: Advertisement }> => {
  const response = await apiClient.post(`/ads/${id}/reject`, {
    reason,
    comment,
  });
  return response.data;
};

export const requestChanges = async (
  id: number,
  reason: string,
  comment?: string
): Promise<{ message: string; ad: Advertisement }> => {
  const response = await apiClient.post(`/ads/${id}/request-changes`, {
    reason,
    comment,
  });
  return response.data;
};
