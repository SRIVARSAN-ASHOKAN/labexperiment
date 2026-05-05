import express from "express";
import { registerCourse } from "../controllers/form.controller.js";

const router = express.Router();

router.post("/course-register", registerCourse);

export default router;
