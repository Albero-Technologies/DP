import API from "./axiosInstance";

export const createTicket = (data) => API.post("/support", data).then(r => r.data);
export const getMyTickets = () => API.get("/support/my").then(r => r.data);
export const getAllTickets = () => API.get("/support").then(r => r.data);

// ✅ Send both reply text AND status
export const replyTicket = (id, reply, status) =>
  API.put(`/support/${id}/reply`, { reply, status }).then(r => r.data);