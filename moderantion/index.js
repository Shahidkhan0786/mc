const express = require('express')
const app = express()
const PORT = 8006
const cors = require('cors')
const morgan = require('morgan')
const { default: axios } = require('axios')
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.get('/' , (req,res)=>{
    res.json({message:"okk"})
})
app.post('/events' ,async (req,res)=>{
    console.log(req.body.type)
    const {type , data} = req.body

    if(type ==='CommentCreated'){
        const status = data.content.includes('orange')?'rejected':'accepted'
        await axios.post('http://event-bus-srv:8005/events',{
            type:'CommentModerated',
            data:{
                ...data,
                status
            }
        })
    }

   
    res.json({message:"okk"})
})

app.listen(PORT , ()=>{
    console.log(`modernation service is up and running on port ${PORT}`);
})