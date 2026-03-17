import API from "./axiosInstance";

export const getSessionsByBatch = (batchId) =>
  API.get(`/sessions${batchId ? `?batchId=${batchId}` : ""}`).then(r => r.data);

export const getMyTrainerSessions = () =>
  API.get("/sessions/trainer").then(r => r.data);

export const createSession = (data) =>
  API.post("/sessions", data).then(r => r.data);

export const updateSession = (id, data) =>
  API.put(`/sessions/${id}`, data).then(r => r.data);

export const deleteSession = (id) =>
  API.delete(`/sessions/${id}`).then(r => r.data);

export const assignTrainerToBatch = (data) =>
  API.post("/sessions/assign-trainer", data).then(r => r.data);