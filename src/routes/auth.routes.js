import { Router } from "express";
import { loginUser, register } from "../controller/auth.controller.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './avatar')
    },
    filename: (req, file, callback) => {
        callback(null, file.orginalname + '.jpg')
    },
})  

const upload = multer({ storage })

const auth = Router()

auth.post('/register',upload.single('avatar'), register)
auth.post('/login', loginUser)

export default auth