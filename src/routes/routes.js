import { Router } from "express";
import auth from "./auth.routes.js";
import rout from "./mems.routes.js";

const router = Router()

router.use('/auth', auth)
router.use('/memes', rout)


export default router