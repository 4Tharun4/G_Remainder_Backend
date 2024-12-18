import mongoose from "mongoose";
import AssignmentSchema from "./AssignmentSchema";
import CoursesSchema from "./coursesSechema";
const Scarpdataschema = new mongoose.Schema({
    userid:{type:String,require:true},
    username:{type:String},
    password:{type:String,require:true},
    Assiggnments:[AssignmentSchema],
    Courses:[CoursesSchema]
});

//assignment schema

export const Scarpdatamodel = mongoose.model('Scarpdata',Scarpdataschema );

export const getdata = ()=> Scarpdatamodel.find();
export const getdatabyuserid = (userid:string) => Scarpdatamodel.findOne({userid});
export const updateUserData = async (userid: string, data: any) => Scarpdatamodel.updateOne({ userid }, {$set:data}, { new: true });

export const crateuser = (values:Record<string,any>)=> new Scarpdatamodel(values).save().then((user)=>user.toObject());
export const updatepassword = (userid:string,values:Record<string,any>)=>  Scarpdatamodel.findByIdAndUpdate(userid,values)