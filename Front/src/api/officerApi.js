import api from "../server/instance";

const API_BASE = "/manager"; 

export const getOfficers = async (search = "") => {
  const params = { role: "officer", name: search };
  const res = await api.get(API_BASE, { params });
  return res.data;
};

export const addOfficer = async (data) => {
  const res = await api.post(API_BASE, data);
  return res.data;
};

export const updateOfficer = async (id, data) => {
  const url = `${API_BASE}/${id}`;
  const res = await api.put(url, data);
  return res.data;
};

export const deleteOfficer = async (id) => {
  const url = `${API_BASE}/${id}`;
  await api.delete(url);
};