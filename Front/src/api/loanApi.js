// src/api/loanApi.js
import api from "../server/instance";

const API_BASE = "/manager/loans";

export const getPendingLoans = async () => {
  console.log("📡 GET /api/manager/loans/pending");
  const res = await api.get(`${API_BASE}/pending`);
  return res.data;
};

export const approveLoan = async (id) => {
  console.log(`📡 PUT /api/manager/loans/${id}/approve`);
  await api.put(`${API_BASE}/${id}/approve`);
};

export const getApprovedLoans = async () => {
  console.log("📡 GET /api/manager/loans/approved");
  const res = await api.get(`${API_BASE}/approved`);
  return res.data;
};

export const rejectLoan = async (id) => {
  console.log(`📡 PUT /api/manager/loans/${id}/reject`);
  await api.put(`${API_BASE}/${id}/reject`);
};