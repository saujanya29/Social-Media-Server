const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const dbConnect = require("./dbConnect");
const authRouter = require('./Routers/authRouter');
const postsRouter = require('./Routers/postRouter')
const userRouter = require('./Routers/userRouter')
const morgan = require("morgan");
const cors = require('cors')
const cookieParsor = require('cookie-parser')
const cloudinary = require('cloudinary').v2
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const app = express();
dbConnect();


// middlewares
// morgan middleware : this logs the api call in console (npm i morgan)
app.use(express.json({limit:'10mb'})); // this is used to accces the body inputs like email,passwords
app.use(cookieParsor());
app.use(morgan('common'))
app.use(cors({
    credentials : true,
    origin:"http://localhost:3000",
}))







const PORT = process.env.PORT || 4001;

app.use('/auth', authRouter );
app.use('/posts',postsRouter);
app.use('/user', userRouter);

app.get("/",(req,res) =>{ 
    res.status(200).send("OK from Server");  
})

app.listen(PORT, ()=>{
    console.log("listening on Port : 4000 ");
})  