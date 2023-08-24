"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var roleSchema = new mongoose_1.Schema({
    role: { type: String, required: true },
    label: { type: String, required: true },
    rank: { type: Number, required: true },
}, { timestamps: true });
var Role = mongoose_1.default.model("Role", roleSchema);
exports.default = Role;
