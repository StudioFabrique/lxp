"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var groupSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    users: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
    },
    /*     students: {
      type: [Schema.Types.ObjectId],
      ref: "Student",
    }, */
    roles: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Role",
        required: true,
    },
}, { timestamps: true });
var Group = (0, mongoose_1.model)("Group", groupSchema);
exports.default = Group;
