import API from "./axiosInstance";

// Students
export const getCounselorStudents = () => API.get("/counselor/students").then(r => r.data);
export const getStudentsWithEnrollment = () => API.get("/counselor/students-with-enrollment").then(r => r.data);
export const createCounselorStudent = (data) => API.post("/counselor/students", data).then(r => r.data);
export const updateCounselorStudent = (id, data) => API.put(`/counselor/students/${id}`, data).then(r => r.data);
export const deleteCounselorStudent = (id) => API.delete(`/counselor/students/${id}`).then(r => r.data);

// Assign + enroll
export const assignTrainerToBatch = (data) => API.post("/counselor/assign-trainer", data).then(r => r.data);
export const enrollStudentToBatch = (data) => API.post("/counselor/enroll-student", data).then(r => r.data);

// Follow-ups
export const getFollowUps = () => API.get("/counselor/followups").then(r => r.data);
export const createFollowUp = (data) => API.post("/counselor/followups", data).then(r => r.data);
export const updateFollowUp = (id, data) => API.put(`/counselor/followups/${id}`, data).then(r => r.data);

// Payments
export const sendPaymentReminder = (data) => API.post("/counselor/payment-reminder", data).then(r => r.data);
export const getAllCounselorPayments = () => API.get("/counselor/all-payments").then(r => r.data);
export const getPendingPayments = () => API.get("/counselor/pending-payments").then(r => r.data);
export const updatePaymentApproval = (id, status) => API.put(`/counselor/payments/${id}/status`, { status }).then(r => r.data);