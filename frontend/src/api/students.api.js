import API from "./axiosInstance";

// Admin
export const getAllStudents = () => API.get("/students").then(r => r.data);
export const getStudentById = (id) => API.get(`/students/${id}`).then(r => r.data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data).then(r => r.data);
export const deleteStudent = (id) => API.delete(`/students/${id}`).then(r => r.data);

// Student portal
export const getStudentCourses = () => API.get("/student/courses").then(r => r.data);
export const getAvailableBatches = () => API.get("/student/available-batches").then(r => r.data);
export const selfEnroll = (batchId) => API.post("/student/enroll", { batchId }).then(r => r.data);
export const submitPayment = (data) => API.post("/student/pay", data).then(r => r.data);
export const getStudentPayments = () => API.get("/student/payments").then(r => r.data);
export const getStudentCertificates = () => API.get("/student/certificates").then(r => r.data);

// Notifications
export const getStudentNotifications = () => API.get("/student/notifications").then(r => r.data);
export const markNotificationRead = (id) => API.patch(`/student/notifications/${id}/read`).then(r => r.data);
export const markAllNotificationsRead = () => API.patch("/student/notifications/read-all").then(r => r.data);