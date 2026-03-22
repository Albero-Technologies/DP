import API from "./axiosInstance";

// Counselors
export const getAllCounselors    = () => API.get("/admin/counselors").then(r => r.data);
export const createCounselor    = (data) => API.post("/admin/create-counselor", data).then(r => r.data);
export const updateCounselor    = (id, data) => API.put(`/admin/update-counselor/${id}`, data).then(r => r.data);
export const deleteCounselor    = (id) => API.delete(`/admin/delete-counselor/${id}`).then(r => r.data);

// Trainers
export const getAllTrainers      = () => API.get("/admin/trainers").then(r => r.data);
export const createTrainer      = (data) => API.post("/admin/create-trainer", data).then(r => r.data);
export const updateTrainer      = (id, data) => API.put(`/admin/update-trainer/${id}`, data).then(r => r.data);
export const deleteTrainer      = (id) => API.delete(`/admin/delete-trainer/${id}`).then(r => r.data);

// Payments
export const getAllAdminPayments  = () => API.get("/admin/payments").then(r => r.data);
export const getPaymentsByStudent = (studentId) => API.get(`/admin/payments/${studentId}`).then(r => r.data);
export const updatePaymentStatus  = (id, status) => API.put(`/admin/payments/${id}/status`, { status }).then(r => r.data);
export const editPayment          = (id, data) => API.put(`/admin/payments/${id}/edit`, data).then(r => r.data);
export const deletePayment        = (id) => API.delete(`/admin/payments/${id}`).then(r => r.data);

// Assign trainer
export const assignTrainer = (data) => API.post("/admin/assign-trainer", data).then(r => r.data);