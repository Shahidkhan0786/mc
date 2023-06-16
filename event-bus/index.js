const express = require("express")
const app = express()
const axios = require("axios")
const PORT = 8005
const morgan = require("morgan")

app.use(express.json())
app.use(morgan('dev'))

const events = [];
app.post('/events',async (req,res)=>{
    const event = req.body;
    events.push(event)
    await axios.post('http://post-clusterip-srv:8001/events' , event).then(res=>console.log(res.data)).catch(e=>console.log(e))
    await axios.post('http://comment-srv:8002/events' , event).then(res=>console.log(res.data)).catch(e=>console.log(e))
    await axios.post('http://query-srv:8003/events' , event).then(res=>console.log(res.data)).catch(e=>console.log(e))
    await axios.post('http://moderation-srv:8006/events' , event).then(res=>console.log(res.data)).catch(e=>console.log(e))

    res.json({message:"ok"})
 })

app.get('/events' , (req,res)=>{


})
 app.listen(PORT ,()=>{
    console.log(`Listining on port ${PORT}`)
 })