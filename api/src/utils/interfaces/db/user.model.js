"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String },
    roles: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Role",
        required: true,
    },
    avatar: { type: String, required: false },
    isActive: { type: Boolean, required: true },
    nickname: { type: String, required: false },
    address: { type: String, required: true },
    postCode: { type: String, required: true },
    city: { type: String, required: true },
    birthDate: { type: Date, required: false },
    phoneNumber: { type: String, required: false },
    group: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: "Group" },
}, { timestamps: true });
var User = mongoose_1.default.model("User", userSchema);
exports.default = User;
