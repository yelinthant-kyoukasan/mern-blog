import express from "express";
import { signUp, signIn } from "../controllers/authController.js";

const router = express.Router();

router.post('/authsignup', signUp)
router.post('/authsignin', signIn)

export default router;