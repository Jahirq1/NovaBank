// src/api/dashboardApi.js
import api from "../server/instance";

const API_BASE = "/manager/dashboard";

export const getDashboardSummary = async () => {
  console.log("📡 GET /api/manager/dashboard/summary");
  const res = await api.get(`${API_BASE}/summary`);
  return res.data;
};

export const getDailyTransactions = async () => {
  console.log("📡 GET /api/manager/dashboard/transactions");
  const res = await api.get(`${API_BASE}/transactions`);
  return res.data;
};

export const getLoanData = async () => {
  console.log("📡 GET /api/manager/dashboard/loans");
  const res = await api.get(`${API_BASE}/loans`);
  return res.data;
};