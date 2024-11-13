"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const user_1 = __importDefault(require("./routes/user"));
const college_1 = __importDefault(require("./routes/college"));
const lecture_1 = __importDefault(require("./routes/lecture"));
const session_1 = __importDefault(require("./routes/session"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const admin_1 = __importDefault(require("./routes/admin"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./db/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.config.frontEndDomain,
}));
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => {
    res.send('Project is working');
});
app.use('/api/v1/user', user_1.default);
app.use('/api/v1/college', college_1.default);
app.use('/api/v1/lecture', lecture_1.default);
app.use('/api/v1/session', session_1.default);
app.use('/api/v1/attendance', attendance_1.default);
app.use('/api/v1/admin', admin_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
// Writing this for testing purpose of commit
