const Post = require("../Models/Post");
const User = require("../Models/User");
const mapPostOutput = require("../utils/Utils");
const { success,error } = require("../utils/responseWrapper");
const cloudinary = require('cloudinary').v2

const getAllPostsController = async (req,res) =>{
    return res.send(success(201,"These are all the post"));
}

const createPostController = async(req,res) =>{

    try {
  
    const {caption,postImg} = req.body; // from input in body and destructured as caption

    if(!caption || !postImg){
      res.send(error(400,'caption and postImg is required'))
    }

    const cloudImg = await cloudinary.uploader.upload(postImg,{
        folder:'postImg'
    })
   

    const owner = req._id; // from middleware
 
    //user is searched 
    const user = await User.findById(req._id);
 
    // post is created in the database 
    const post = await Post.create({
        owner,
        caption,
        image:{
            publicId : cloudImg.public_id,
            url:  cloudImg.secure_url
        },
    })
   
    // this post is pushed in the logged user nd saved
     user.posts.push(post._id);
     await user.save();

     return res.send(success(201,post));

    } catch (e) {
        return res.send(error(500,e.message))
    }

    
}


const LikeOrDislikePost = async(req,res) =>{

    try {
        
        const {postId} = req.body;
        const currUserId = req._id;

        const post = await Post.findById(postId);
        console.log(post);
        
         if(!post){
            res.send(error(404,"post not Found"))
         }
    
         if(post.likes.includes(currUserId)){
            const index = post.likes.indexOf(currUserId);
            post.likes.splice(index,1);
    
         }
         else{
            post.likes.push(currUserId);
           
         } 
      
         await post.save();
         return res.send(success(200,{post : mapPostOutput(post,req._id)}))


    } catch (e) {
        console.log(e);
        return res.send(error(501,e.message))
    }
   
}


const UpdatePostController = async(req,res) =>{

     try {
        
        const currUserid = req._id;
        const {postId , caption} =req.body
        // const currUser = await User.findById(currUserid);
        const post = await Post.findById(postId)
    
        if(!post){
            return res.send(error(404,"post not found"))
        }
    
        if(post.owner.toString() !== currUserid){
            return res.send(error(404,"only owners can update the post"))
        }
    
        if(caption){
            post.caption = caption;
        }
        await post.save()
        res.send(success(200,{post}))




     } catch (error) {
        return res.send(error(500,e.message))
     }


    

}


const deletePost = async(req,res)=>{

    try {
        console.log("coming here ");
        const {postId}= req.body
        const currUserid = req._id;
    
        const post = await Post.findById(postId)
        const CurrUser  = await User.findById(currUserid)
        
        if(!post){
            return res.send(error(404,"post not found"))
        }
    
        if(post.owner.toString() !== currUserid){
            return res.send(error(404,"only owners can delete the post"))
        }
       
        const index = CurrUser.posts.findById(postId);
        CurrUser.posts.splice(index,1);
        await CurrUser.save();
        await post.remove();
    
    
        return res.send(success(201,"post is deleted succesfully"))
    


    } catch (e) {
        console.log(e);
        return res.send(error(500,e.message))
    }
    
}

module.exports = {
    getAllPostsController,
    createPostController,
    LikeOrDislikePost,
    UpdatePostController,
    deletePost,
}