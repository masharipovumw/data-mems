import { Router } from "express";
import { authCheck } from "../middlewares/auth-check.js";
import { PostMem, comments , SerchMems, Allcomments, like, share} from "../controller/mems.controller.js";
import multer from "multer";
import { nanoid } from "nanoid";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './upload')
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(7) + '.jpg')
    },
})  

const upload = multer({ storage })

const rout = Router()

rout.post('/memes',upload.single('image'),authCheck(false),PostMem)
rout.post('/memes/:id/comments', authCheck(false), comments)
rout.get('/memes/:id',SerchMems)
rout.get('/memes/:id/share',share)
rout.get('/memes/:id/comments',authCheck(false),Allcomments)
rout.patch('/memes/:id/like',authCheck(false),like)

export default rout