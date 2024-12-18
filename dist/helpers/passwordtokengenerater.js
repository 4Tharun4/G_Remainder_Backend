"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
;
const GenerateToken = (Password) => {
    const payload = { Password };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET_KEY);
};
exports.default = GenerateToken;
//# sourceMappingURL=passwordtokengenerater.js.map