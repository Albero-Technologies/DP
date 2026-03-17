import API from "./axiosInstance";

export const getTrainerBatches = () => API.get("/trainer/batches").then(r => r.data);
export const getTrainerStudents = () => API.get("/trainer/students").then(r => r.data);
