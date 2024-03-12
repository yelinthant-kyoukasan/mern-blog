import express from "express";
import { signUp, signIn, google } from "../controllers/authController.js";

const router = express.Router();

router.post('/authsignup', signUp)
router.post('/authsignin', signIn)
router.post('/google', google)

export default router;