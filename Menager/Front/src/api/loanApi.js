const API_BASE = "http://localhost:5221/api/loans";

export const getPendingLoans = async () => {
  const res = await fetch(`${API_BASE}/pending`);
  if (!res.ok) throw new Error("Failed to fetch loans");
  return res.json();
};

export const approveLoan = async (id) => {
  const res = await fetch(`${API_BASE}/${id}/approve`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to approve loan");
};

export const getApprovedLoans = async () => {
  const res = await fetch(`${API_BASE}/approved`);
  if (!res.ok) throw new Error("Failed to fetch approved loans");
  return res.json();
};

export const rejectLoan = async (id) => {
  const res = await fetch(`${API_BASE}/${id}/reject`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to reject loan");
};
