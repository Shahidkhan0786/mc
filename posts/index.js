const express = require("express")
const app = express()
const {randomBytes} = require('crypto')
const PORT = 8001
const cors = require('cors')
const axios = require("axios")
const morgan = require("morgan")
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
const posts = {};
app.get('/posts' ,(req,res)=>{
    res.send(posts)
})

app.post('/posts/create' ,async (req,res)=>{
    const id = randomBytes(4).toString('hex')
    const {title} = req.body;
    posts[id] ={
        id,title
    }

    await axios.post('http://event-bus-srv:8005/events' , {
        type:"PostCreated",
        data:{id,title}
    }).then(res=>console.log(res.data)).catch(e=>console.log("error in requst"))
    res.status(201).send(posts[id])
});

app.post('/events', (req,res)=>{
    console.log("Event Received" , req.body.type)
    res.status(200).json({})
});

app.get('/homee' ,(req,res)=>{
    res.send('homee')
})
app.get('/' ,(req,res)=>{
    res.send('home')
})



app.listen(PORT ,()=>{
    console.log("version" , "0.1.1")
    console.log("version" , "0.1.1")
    console.log("version" , "0.1.1")
    console.log("version" , "0.1.1")

    console.log(`post service is up and running on port ${PORT}`)
})