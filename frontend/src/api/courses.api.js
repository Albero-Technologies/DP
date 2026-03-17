import API from "./axiosInstance";

export const getAllCourses = async () => {
  const res = await API.get("/courses");
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await API.get(`/courses/${id}`);
  return res.data;
};

export const createCourse = async (courseData) => {
  const res = await API.post("/courses", courseData);
  return res.data;
};

export const updateCourse = async (id, courseData) => {
  const res = await API.put(`/courses/${id}`, courseData);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await API.delete(`/courses/${id}`);
  return res.data;
};
