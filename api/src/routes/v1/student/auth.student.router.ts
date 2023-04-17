import express from "express";
import httpStudentLogin from "../../../controllers/auth/student-login";

const studentAuth = express.Router();

studentAuth.post("/login", httpStudentLogin);
studentAuth.get("/logout");
studentAuth.get("/handshake");

export default studentAuth;
