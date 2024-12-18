"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatepassword = exports.crateuser = exports.updateUserData = exports.getdatabyuserid = exports.getdata = exports.Scarpdatamodel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AssignmentSchema_1 = __importDefault(require("./AssignmentSchema"));
const coursesSechema_1 = __importDefault(require("./coursesSechema"));
const Scarpdataschema = new mongoose_1.default.Schema({
    userid: { type: String, require: true },
    username: { type: String },
    password: { type: String, require: true },
    Assiggnments: [AssignmentSchema_1.default],
    Courses: [coursesSechema_1.default]
});
//assignment schema
exports.Scarpdatamodel = mongoose_1.default.model('Scarpdata', Scarpdataschema);
const getdata = () => exports.Scarpdatamodel.find();
exports.getdata = getdata;
const getdatabyuserid = (userid) => exports.Scarpdatamodel.findOne({ userid });
exports.getdatabyuserid = getdatabyuserid;
const updateUserData = async (userid, data) => exports.Scarpdatamodel.updateOne({ userid }, { $set: data }, { new: true });
exports.updateUserData = updateUserData;
const crateuser = (values) => new exports.Scarpdatamodel(values).save().then((user) => user.toObject());
exports.crateuser = crateuser;
const updatepassword = (userid, values) => exports.Scarpdatamodel.findByIdAndUpdate(userid, values);
exports.updatepassword = updatepassword;
//# sourceMappingURL=data.js.map