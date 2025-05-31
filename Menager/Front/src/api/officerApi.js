// src/api/officerApi.js
import api from "./apiClient";

const API_BASE = "/manager"; // apiClient already has baseURL: http://localhost:5231/api

export const getOfficers = async (search = "") => {
  const params = { role: "officer", name: search };
  console.log("📡 GET /api/manager with", params);
  const res = await api.get(API_BASE, { params });
  return res.data;
};

export const addOfficer = async (data) => {
  console.log("📡 POST /api/manager", data);
  const res = await api.post(API_BASE, data);
  return res.data;
};

export const updateOfficer = async (id, data) => {
  const url = `${API_BASE}/${id}`;
  console.log(`📡 PUT /api/manager/${id}`, data);
  const res = await api.put(url, data);
  return res.data;
};

export const deleteOfficer = async (id) => {
  const url = `${API_BASE}/${id}`;
  console.log(`📡 DELETE /api/manager/${id}`);
  await api.delete(url);
};
