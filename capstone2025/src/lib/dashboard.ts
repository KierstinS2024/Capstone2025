// Path: src/lib/dashboard.ts
import axios from "axios";
import { DashboardData } from "@/types/dashboard";

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const res = await axios.get<DashboardData>("/api/dashboard", {
    withCredentials: true,
  });
  return res.data;
};
