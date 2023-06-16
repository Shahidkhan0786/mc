const express = require("express")
const app = express()
const {randomBytes} = require('crypto')
const cors = require("cors")
const morgan = require("morgan")
const axios = require("axios")
const PORT = 8002
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
const commentsByPostId = {};
app.get('/posts/:id/comments' ,(req,res)=>{
    const comments =  commentsByPostId[req.params.id] || [];

    res.send(comments)
})

app.post('/posts/:id/comments' ,async (req,res)=>{
    const id = randomBytes(4).toString('hex')
    const {content} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id , content ,status:"pending"});
    commentsByPostId[req.params.id] = comments;
    const postId= req.params.id
    await axios.post('http://event-bus-srv:8005/events' , {
        type:"CommentCreated",
        data:{id,content,postId,status:"pending"}
    }).then(res=>console.log(res.data)).catch(e=>console.log(e))
    res.status(201).send(comments)
})

app.post('/events', async (req,res)=>{
    console.log("Event Received" , req.body.type)
    const {type , data} = req.body
       if(type ==="CommentModerated"){
        // console.log('innnn commentsss' , req.body)
        const {id,postId,status} = req.body.data
        const comments = commentsByPostId[postId]
        const comment = comments.find(comment=>{
            return comment.id == data.id
        })

        // console.log('com',comment)
        comment.status = data.status
        // console.log('aft com',comment)

        await axios.post('http://event-bus-srv:8005/events' , {
            type:"CommentUpdated",
            data: comment
        }).then(res=>console.log(res.data)).catch(e=>console.log(e))
    }
    res.status(200).json({})
});


app.listen(PORT ,()=>{
    console.log(`comment service is up and running on port ${PORT}`)
})