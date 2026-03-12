import { Router } from "express";
import { addMemberToProject, createProject, deleteMemberFromProject, getProjects, getProjectById, getProjectMembers, updateProject, deleteProject, updateMemberRole } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator, addMemberToProjectValidator } from "../validators/index.js";
import { verifyJWT, validateRole } from "../middlewares/auth.middleware.js";
import { availableRoleEnum, UserRolesEnum } from "../utils/constatns.js";

const router = Router();

router.use(verifyJWT)

router
     .route("/")
     .get(getProjects)
     .post(createProjectValidator(), validate, createProject)

router
    .route("/:projectId")
    .get(validateRole(availableRoleEnum), getProjectById)
    .put(
        validateRole([UserRolesEnum.ADMIN]),
        createProjectValidator(),
        validate,
        updateProject
    )
    .delete(validateRole([UserRolesEnum.ADMIN]), deleteProject)

router
     .route("/:projectId/members")
     .get(getProjectMembers)
     .post(
        validateRole([UserRolesEnum.ADMIN]),
        addMemberToProjectValidator(),
        validate,
        addMemberToProject
     )

router
     .route("/:projectId/members/:userId")
     .put(
        validateRole([UserRolesEnum.ADMIN]),
        updateMemberRole
     )
     .delete(validateRole([UserRolesEnum.ADMIN]), deleteMemberFromProject)


export default router;