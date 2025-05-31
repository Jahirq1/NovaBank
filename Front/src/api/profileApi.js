// src/api/profileApi.js
import api from "../server/instance";

const API_BASE = "/manager/profile";

export const getProfile = async () => {
  console.log(`📡 GET /api/manager/profile`);
  const res = await api.get(API_BASE);
  return res.data;
};

export const updateProfile = async (data) => {
  console.log(`📡 PUT /api/manager/profile`, data);
  const res = await api.put(API_BASE, data);
  return res.data;
};