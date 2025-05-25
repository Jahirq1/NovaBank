const API_BASE = "http://localhost:5221/api/dashboard";

export const getDashboardSummary = async () => {
  const res = await fetch(`${API_BASE}/summary`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
};

export const getDailyTransactions = async () => {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

export const getLoanData = async () => {
  const res = await fetch(`${API_BASE}/loans`);
  if (!res.ok) throw new Error("Failed to fetch loan data");
  return res.json();
};
