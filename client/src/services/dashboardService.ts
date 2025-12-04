import { api } from "./api";
import { API_ENDPOINTS } from "../config/api";

export const getDashboardData = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD_DATA);
  return response.data;
};
