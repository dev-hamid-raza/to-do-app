import { Document } from "mongoose";

export interface IDepartment extends Document {
    departmentName: string
}