import API from "./axiosInstance";

export const getAllDemoCourses = () => API.get("/demo-courses").then(r => r.data);
export const createDemoCourse = (data) => API.post("/demo-courses", data).then(r => r.data);
export const updateDemoCourse = (id, data) => API.put(`/demo-courses/${id}`, data).then(r => r.data);
export const deleteDemoCourse = (id) => API.delete(`/demo-courses/${id}`).then(r => r.data);
