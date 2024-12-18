"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const verifyToken = (Password) => {
    // console.log("Token:", Password);
    try {
        const decoded = jsonwebtoken_1.default.verify(Password, JWT_SECRET_KEY);
        //console.log("Decoded:", decoded);
        if (decoded && typeof decoded.Password === 'string') {
            return decoded.Password;
        }
        else {
            // console.error('Decoded token does not contain a valid password.');
            return null;
        }
    }
    catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
exports.default = verifyToken;
//# sourceMappingURL=VerifyPasswordToken.js.map