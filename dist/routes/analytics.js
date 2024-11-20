"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const analytics_1 = require("../controllers/analytics");
const analyticsRouter = express_1.default.Router();
analyticsRouter.get('/daily-analytics', auth_1.default, analytics_1.getDailyAnalytics);
analyticsRouter.get('/weekly-analytics', auth_1.default, analytics_1.getWeeklyAnalytics);
analyticsRouter.get('/all-analytics', auth_1.default, analytics_1.getAllDatesAnalytics);
exports.default = analyticsRouter;
