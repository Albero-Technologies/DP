import API from "./axiosInstance";

export const getAllLeads = () => API.get("/leads").then(r => r.data);
export const createLead = (data) => API.post("/leads", data).then(r => r.data);
export const updateLead = (id, data) => API.put(`/leads/${id}`, data).then(r => r.data);
export const deleteLead = (id) => API.delete(`/leads/${id}`).then(r => r.data);
export const getFollowUps = () => API.get("/leads/followups").then(r => r.data);
export const createFollowUp = (data) => API.post("/leads/followups", data).then(r => r.data);
