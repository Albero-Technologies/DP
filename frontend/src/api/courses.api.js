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

// ── Multiple videos ──────────────────────────────────────────
export const addCourseVideo = async (courseId, videoData) => {
  // videoData = { title, url, order }
  const res = await API.post(`/admin/courses/${courseId}/videos`, videoData);
  return res.data;
};

export const deleteCourseVideo = async (courseId, videoId) => {
  const res = await API.delete(`/admin/courses/${courseId}/videos/${videoId}`);
  return res.data;
};