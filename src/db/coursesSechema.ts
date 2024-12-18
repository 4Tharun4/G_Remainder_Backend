import mongoose from "mongoose";

const CoursesSchema = new mongoose.Schema({
    courseName:{type:String},
    courseCode:{type:String},
    courseCompletion:{type:String},
    semester:{type:String}
})

export default CoursesSchema;