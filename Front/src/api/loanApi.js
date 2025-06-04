import api from '../server/instance';  

export const getPendingLoans = async () => {
  const response = await api.get('/manager/loans/pending');
  return response.data;
};

export const getApprovedLoans = async () => {
  const response = await api.get('/manager/loans/approved');
  return response.data;
};

export const getRejectedLoans = async () => {
  const response = await api.get('/manager/loans/rejected');
  return response.data;
};

export const approveLoan = async (loanId) => {
  await api.put(`/manager/loans/${loanId}/approve`);
};

export const rejectLoan = (loanId, reason) => {
  return api.put(`/manager/loans/${loanId}/reject`, {
    reason: reason
  });
};

