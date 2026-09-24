
import {
  DistrictsApiResponse,
  AlertsApiResponse,
  SingleDistrictApiResponse,
} from '../types';
import api from './api';


export async function getAllDistricts(): Promise<DistrictsApiResponse> {
  const { data } = await api.get<DistrictsApiResponse>('/districts');
  return data;
}

export async function getDistrict(name: string): Promise<SingleDistrictApiResponse> {
  const { data } = await api.get<SingleDistrictApiResponse>(`/districts/${name}`);
  return data;
}

export async function getAlertHistory(
  district?: string,
  limit = 20
): Promise<AlertsApiResponse> {
  const params: Record<string, string | number> = { limit };
  if (district) params.district = district;
  const { data } = await api.get<AlertsApiResponse>('/alerts', { params });
  return data;
}

export async function registerDeviceToken(
  token: string,
  district: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/districts/register-token', { token, district });
  return data;
}

export async function triggerRefresh(): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/districts/refresh');
  return data;
}

export default api;