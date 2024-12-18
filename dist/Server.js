"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const routers_1 = __importDefault(require("./routers/routers"));
const Schedule_1 = __importDefault(require("../src/routers/Schedule"));
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
const server = http_1.default.createServer(app);
server.listen(8080, () => {
    console.log("server is running in port http://localhost:8080/");
});
node_cron_1.default.schedule('0 * * * *', async () => {
    console.log('Running a task every minute');
    (0, Schedule_1.default)();
});
//db connect
const MONGODB_URL = process.env.MONGODB_URL;
mongoose_1.default.connect(MONGODB_URL);
mongoose_1.default.Promise = Promise;
mongoose_1.default.connection.on("error", (error) => {
    console.log(error);
});
app.use("/api/V1", (0, routers_1.default)());
//# sourceMappingURL=Server.js.map