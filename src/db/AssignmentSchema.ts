import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    assignmentTitle:{type:String},
    subjectCode:{type:String},
    assignmentDate:{type:String}
})

export default AssignmentSchema;