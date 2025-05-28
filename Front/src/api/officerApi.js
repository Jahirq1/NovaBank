const API_BASE = "http://localhost:5231/api/manager/users";

export const getOfficers = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch officers");
  return res.json();
};

export const addOfficer = async (data) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to add officer");
  return res.json();
};

export const updateOfficer = async (id, data) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update officer");
  return res.json();
};

export const deleteOfficer = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete officer");
};
