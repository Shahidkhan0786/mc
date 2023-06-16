const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PORT = 8003
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
var posts ={};
app.post('/events',(req,res)=>{
    console.log("Received Event" , req.body)
    if(req.body.type ==="PostCreated"){
        const {id ,title} = req.body.data;
        posts[id] = {id ,title, comments:[]}
    }
    if(req.body.type ==="CommentCreated"){
        const {id,content,postId,status} = req.body.data
        const post = posts[postId]
        post.comments.push({id,content,status})
    }
    if(req.body.type ==='CommentUpdated'){

        const {id,content,postId,status} = req.body.data
        const post = posts[postId]
        const comment = post.comments.find((com)=>{
            return com.id = id
        })
        comment.status = status
    }
    res.json({message:"ok"})
})

app.get('/posts' ,(req,res)=>{
    console.log(posts)
    res.send(posts)
})

app.listen(PORT , ()=>{
    console.log(`Query service is up and running on port ${PORT}`)
})