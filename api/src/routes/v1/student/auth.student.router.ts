import express from "express";
import httpStudentLogin from "../../../controllers/auth/student-login";
import httpHandshake from "../../../controllers/student/httpHandshake";
import isStudent from "../../../middleware/isStudent";

const studentAuth = express.Router();

studentAuth.post("/login", httpStudentLogin);
studentAuth.get("/logout");
studentAuth.get("/handshake", isStudent, httpHandshake);

export default studentAuth;
