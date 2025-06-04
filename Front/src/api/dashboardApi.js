import api from "../server/instance";

const API_BASE = "/manager/dashboard";

export const getDashboardSummary = async () => {
  const res = await api.get(`${API_BASE}/summary`);
  return res.data;
};

export const getDailyTransactions = async () => {
  const res = await api.get(`${API_BASE}/transactions`);
  return res.data;
};

export const getLoanData = async () => {
  const res = await api.get(`${API_BASE}/loans`);
  return res.data;
};