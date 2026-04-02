import mongoose, {Schema} from "mongoose";
import { availableRoleEnum, UserRolesEnum } from "../utils/constatns.js";

const projectMemberSchema = new Schema({
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     },

     project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
     },
     role:{
        type: String,
        enum: availableRoleEnum,
        default: UserRolesEnum.MEMBER
     }
}, {timestamps: true});

export const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);