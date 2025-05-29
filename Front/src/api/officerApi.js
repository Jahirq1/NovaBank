import axios from "axios";

const API_BASE = "http://localhost:5231/api/manager"; // correct endpoint

export const getOfficers = async (search = "") => {
  const params = {
    role: "officer",
    name: search,
  };

  const url = `${API_BASE}`;
  console.log("📡 GET request to:", url, "with params", params);

  const res = await axios.get(url, { params });
  return res.data;
};

export const addOfficer = async (data) => {
  console.log("📡 POST request to:", API_BASE);
  console.log("Payload:", data);

  const res = await axios.post(API_BASE, data);
  return res.data;
};

export const updateOfficer = async (id, data) => {
  const url = `${API_BASE}/${id}`;
  console.log("📡 PUT request to:", url);
  console.log("Payload:", data);

  const res = await axios.put(url, data);
  return res.data;
};

export const deleteOfficer = async (id) => {
  const url = `${API_BASE}/${id}`;
  console.log("📡 DELETE request to:", url);

  await axios.delete(url);
};
