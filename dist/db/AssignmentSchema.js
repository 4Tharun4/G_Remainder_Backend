"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AssignmentSchema = new mongoose_1.default.Schema({
    assignmentTitle: { type: String },
    subjectCode: { type: String },
    assignmentDate: { type: String }
});
exports.default = AssignmentSchema;
//# sourceMappingURL=AssignmentSchema.js.map