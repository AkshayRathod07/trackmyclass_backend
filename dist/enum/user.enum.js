"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = exports.userRole = void 0;
var userRole;
(function (userRole) {
    userRole["STUDENT"] = "STUDENT";
    userRole["ADMIN"] = "ADMIN";
    userRole["SUPERADMIN"] = "SUPERADMIN";
})(userRole || (exports.userRole = userRole = {}));
exports.role = ['STUDENT', 'ADMIN', 'SUPERADMIN'];
