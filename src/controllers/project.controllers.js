import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { apiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async.js";
import { UserRolesEnum } from "../utils/constatns.js";

export const getProjects = asyncHandler(async (req, res) => {
  const memberships = await ProjectMember.find({
    user: new mongoose.Types.ObjectId(req.user._id),
  })
    .populate({
      path: "project",
      populate: {
        path: "createdBy",
        select: "username fullName email avatar",
      },
    })
    .populate("user", "username fullName email avatar");

  return res
    .status(200)
    .json(new apiResponse(200, memberships, "Projects retrieved successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).populate(
    "createdBy",
    "username fullName email avatar",
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, project, "Project retrieved successfully"));
});

export const createProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(userId),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new apiResponse(201, project, "Project created successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Project deleted successfully"));
});

export const addMemberToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const member = await ProjectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  return res
    .status(200)
    .json(new apiResponse(200, member, "Member added to project successfully"));
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const projectMembers = await ProjectMember.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("user", "username fullName email avatar");

  return res
    .status(200)
    .json(new apiResponse(200, projectMembers, "Project members retrieved successfully"));
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { role } = req.body;

  const updatedMember = await ProjectMember.findOneAndUpdate(
    {
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(userId),
    },
    { role },
    { new: true },
  );

  if (!updatedMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedMember, "Member role updated successfully"));
});

export const deleteMemberFromProject = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  const deletedMember = await ProjectMember.findOneAndDelete({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!deletedMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Member deleted from project successfully"));
});