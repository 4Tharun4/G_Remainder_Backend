"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
exports.default = (router) => {
    //@ts-ignore
    router.post('/auth/login', authentication_1.register);
};
//# sourceMappingURL=authroute.js.map