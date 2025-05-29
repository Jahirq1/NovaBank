const API_PROFILE = "http://localhost:5231/api/manager/profile";

export const getProfile = async (id) => {
  const res = await fetch(`${API_PROFILE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const updateProfile = async (id, data) => {
  const res = await fetch(`${API_PROFILE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};
