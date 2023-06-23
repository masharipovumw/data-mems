import { all, get, run } from "../dbhelper.js"

export const PostMem = async (req, res) => {
    
    const author = +res.locals.user.userId
    console.log(author)
    
    const { description } = req.body

    

    const image = req.file.filename

    const deta = new Date().toDateString()

    const sql = `INSERT INTO mems (decription , image , dete,author) VALUES (?,?,?,?);`
    
    await run(sql, [description, image, deta, author])
    
    res.status(201).json({
        description,
        image
    })

}   

export const comments = async (req, res) => {
    const { comment } = req.body

    const id = +req.params.id
    const userId = +res.locals.user.userId

    console.log(req.body);
    
    const sql = `INSERT INTO comments ( comment ,userId, pictureId  ) VALUES(?,?,?);`

    await run(sql,[comment,userId,id])

    res.status(201).json({
        comment
    })
}

export const SerchMems = async (req, res) => {
    const id = +req.params.id

    const commentSql = `
    SELECT
        comment
    FROM 
        comments
    WHERE pictureId = ?;
        
    `
    const comment = await all(commentSql, [id])
    
    const shareSql = `
    SELECT
        userId 
    FROM 
        share
    WHERE pictureId = ?;
    `
    const share = await all(shareSql, [id])

    const likeSql = `
    SELECT 
        liked 
    FROM 
        like 
    WHERE pictureId = ?;`

    const like = await all(likeSql, [id])

    const AuthorSql = `
    SELECT
        userId AS id ,
        nickname
    FROM auth
    INNER JOIN mems ON auth.userId = mems.author
    WHERE mems.id = ? ;
 
    `
    const author = await all(AuthorSql, [id])


    const sql = `
    SELECT 
        dete AS createAt,
        decription AS decription,
        image AS image
    FROM mems
    WHERE mems.id = ?
    `
    const mem = await all(sql, [id])
    
    res.status(200).json({    
        id,
        author ,
        mem: {
            mem,
            likes: like.length,
            shares: share.length,
            comment: comment.length
        }
    })
}

export const Allcomments = async (req, res) => {
    
    const id = +req.params.id
    const userId = +res.locals.user.userId

    console.log(userId);


    const userSql = ` 
    SELECT
        auth.userId AS id,
        auth.nickname
    FROM auth
    INNER JOIN comments ON auth.userId = comments.userId
    WHERE auth.userId =?;
    `
    const user = await all(userSql, [userId])

    const commentSql = `
        SELECT 
            comments.comment AS comment
        FROM comments
        WHERE pictureId = ? AND userId = ? ;   
    `
    const mems = await all(commentSql, [id,userId])

    
    res.status(200).json({
        id : userId,
        mems,
        author: {
            user
        }
    })
}

export const like = async(req, res) => {
    const id = +req.params.id
    const userId = +res.locals.user.userId

    const sql = `
    INSERT INTO 
        like (userId, pictureId) 
    VALUES(?,?);
    `
    await run(sql,[userId,id])
    
    
    const likesql = `
    UPDATE like SET
        liked = 'true'
    WHERE pIctureId = ?;
    `
    await run(likesql, [id])

    const getLike = `
    SELECT liked FROM like;
    `
    const like = await get(getLike)

    res.status(201).json({
        like
    })

}

export const share = async (req, res) => {

    const id = +req.params.id
    const userId = +res.locals.user.userId
 
    const sql = `
    INSERT INTO 
        share (userId, pictureId) 
    VALUES(?,?);`

    await run(sql,[userId,id])


    const branch = `http://localhost:5050/ecommerce/v1/memes/memes/${id}`

    console.log(branch)

    
    res.status(201).json({
        ShareLink:branch
    })
}