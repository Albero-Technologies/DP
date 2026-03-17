import Course from "./course.model.js";
import mongoose from "mongoose";

export const createCourse = async (courseData, adminId) => {
  const { title, description, durationInMonths, fees, youtubeLink } = courseData;

  const existingCourse = await Course.findOne({ title });
  if (existingCourse) {
    throw new Error("Course with this title already exists");
  }

  // Only set createdBy if it's a valid ObjectId (not "admin-env")
  const courseDoc = { title, description, durationInMonths, fees, youtubeLink };
  if (adminId && adminId !== "admin-env" && mongoose.Types.ObjectId.isValid(adminId)) {
    courseDoc.createdBy = adminId;
  }

  const course = await Course.create(courseDoc);
  return course;
};

export const getAllCourses = async () => {
  return await Course.find().sort("-createdAt");
};

export const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new Error("Course not found");
  return course;
};

export const updateCourse = async (id, updateData) => {
  const { title, description, durationInMonths, fees, youtubeLink } = updateData;

  const course = await Course.findById(id);
  if (!course) throw new Error("Course not found");

  // Check title uniqueness only if title changed
  if (title && title !== course.title) {
    const existing = await Course.findOne({ title });
    if (existing) throw new Error("Course with this title already exists");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    {
      title:            title            ?? course.title,
      description:      description      ?? course.description,
      durationInMonths: durationInMonths ?? course.durationInMonths,
      fees:             fees             ?? course.fees,
      youtubeLink:      youtubeLink      ?? course.youtubeLink,  // ← was missing!
    },
    { new: true, runValidators: false }
  );

  return updatedCourse;
};

export const deleteCourse = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new Error("Course not found");
  await Course.findByIdAndDelete(id);
  return course;
};