const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const dotenv = require('dotenv').config()
const User = require('./models/userModel')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')


const app = express()
const router = express.Router()
connectDB()





app.use(morgan('tiny'))
app.use(cors())
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(express.json())
app.use(router);

router.post("/signup",async(req,res)=>{
    try{
        console.log('pppdd',req.body);
        const userExist = await User.findOne({email:req.body.email})
        if(userExist){
            res.status(202).json({message:'Already have account'})
        }else{
            const password =  bcrypt.hashSync(req.body.password,10)
            console.log(password);
            Object.assign(req.body,{password})
            const user = new User(req.body)
            user.save().then((response)=>{
                console.log(response,process.env.JWT_SECRET);
                console.log('pppppppppp');
            const token = jwt.sign({id:response._id,name:response.name},'faheem',{expiresIn: 86400})
            console.log(token,'llll');
            res.status(200).json({token})
            }).catch((e)=>{
                console.log(e,'p');
            })

        }
        

    }catch(e){

    }

    
}) 



router.post('/login',async(req,res)=>{
    try {
        console.log(req.body,';;;');
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
         
    
          res.status(200).json({ name:user.name });
        } else {
          res.status(201).json({ mesaage: "something wrong", number: req.body.number });
        }
      } catch (err) {}
})



app.listen(4000,(err)=>{
  console.log(err,'kitty');
})