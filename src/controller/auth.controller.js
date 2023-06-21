import md5 from "md5"
import { nanoid } from "nanoid"
import { get, run } from "../dbhelper.js"

export const register = async (req, res) => {
    const { name, surname, nickname, password } = req.body
    // const nikname = res.locals.user.nickname



    const avatar = req.file.filname
    
    const token = md5(password + name + nanoid(20))

    const sql = `INSERT INTO auth ( name,surname,nickname,password,token,avatar) VALUES(?,?,?,?,?,?)`

    const user = await run(sql, [name, surname, nickname, password, token,avatar])
    // if (!user) {
    //     res.status(400).json({
    //         message: `Invalid body params`,
    //     })
    // }
    // else if (user.nickname === nikname) {
    //     res.status(409).json({
    //         message : 'username already taken'
    //     })
    // } else {
        res.status(201).json({
            name,
            surname,
            nickname,
            password,
            token,
            avatar
        })  
    // } 
}
export const loginUser = async (req, res) => {
    const { nickname, password } = req.body

    const sql = 'SELECT * FROM auth WHERE nickname = ?'

    const user = await get(sql, [nickname])

    if (!user) {
        res.status(400).json({
            message: `Invalid body params`,
        })
    } else if (user.password !== password) {
        res.status(401).json({
            message: `User not found or wrong credentials   `,
        })
    } else {
        const {userId, nickname, name, surname, token } = user

        res.status(200).json({
            userId,
            nickname,
            name,
            surname,
            token,
        })
    }
}