
const { error, success } = require("../utils/responseWrapper");
const User = require("../Models/User");
const Post = require('../Models/Post');
const mapPostOutput = require("../utils/Utils");
const cloudinary = require('cloudinary').v2



const FollowOrUnfollowUser  = async (req,res)=>{


    try {


        const {userIdToFollow} = req.body;
        const currUserId = req._id;
    
        const userToFollow = await User.findById(userIdToFollow);
        const currUser =  await User.findById(currUserId);
        // console.log("userToFollow",userToFollow);
        // console.log("currUser",currUser.following);

        if(currUserId === userIdToFollow){
            res.send(error(409,"user can not follow themselves"))
        }


        if(!userToFollow){
            res.send(error(501,"user to follow not found"))
        }
        
        console.log("currUser",currUser);
        if(currUser.following.includes(userIdToFollow)){// Already Followed
         
            const index = currUser.following.indexOf(userIdToFollow);
            currUser.following.splice(index,1);
    
            const followerIndex = userToFollow.followers.indexOf(currUserId);
            userToFollow.followers.splice(followerIndex,1)
    
        }
        else{
            currUser.following.push(userIdToFollow);
            userToFollow.followers.push(currUserId);
    
        }

        await userToFollow.save();
        await currUser.save();
       return res.send(success(201,{user:userToFollow}))


        
    } catch (e) {
        console.log(e);
        res.send(error(501,e.message))
    }
 
   

}



const getPostOfFollowing = async(req,res)=>{
    try {
        
       const currUserId = req._id;
       const currUser = await User.findById(currUserId).populate("following");


       const FullPosts = await Post.find({
           "owner": {
              "$in" : currUser.following
           }
       }).populate('owner');


       const posts = FullPosts.map((item) => mapPostOutput(item,req._id)).reverse();

       const followingIds = currUser.following.map((item)=> item._id);
       followingIds.push(req._id)

       const suggestions = await User.find({
        _id:{
            $nin:followingIds
        }
       });

      return res.send(success(200,{...currUser._doc,suggestions,posts}))

    } catch (e) {
        return res.send(error(500,e.message))
    }
}

 const getMyPost = async(req,res)=>{
    

    try {
        

        const currUserId = req._id;

        const allUserPost = await Post.find({
            owner : currUserId
        })
    
        return res.send(success(200,{allUserPost}))

        
    } catch (e) {
        return res.send(error(500,e.message))
    }
    
 }



const getUserPosts = async (req,res)=>{

try {
    
    const currUserId = req._id;
    
    const allUserPost = await Post.find({
        owner : currUserId
    }).populate('likes') // this will also show the users info who like this post 

    return res.send(success(200,{allUserPost}))


} catch (e) {
    return res.send(error(500,e.message))
}
 }

 const deleteMyProfile = async(req,res) =>{


    try {
        
        const currUserId = req._id;
        const currUser = await User.findById(currUserId);
    
        // delete my post
        await Post.deleteMany({
            owner: currUserId
        })
    
        // remove myself from the follower's following
    
        currUser.followers.forEach(async(followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.following.indexOf(currUserId);
            console.log(index);
            if(index>=0){
                follower.following.splice(index,1)
            }
           
            console.log(index);
            await follower.save()
        });
    
     // remove myself from the folloings follower list  
        currUser.following.forEach(async(followingsId) => {
            const followings = await User.findById(followingsId);
            const index = followings.followers.indexOf(currUserId);
            console.log(index);
            followings.followers.splice(index,1)
            console.log(index);
            await followings.save()
        });
    
        // remove myself from all the likes 
    
        const allPost = await Post.find();
        allPost.forEach(async (post) => {
            const index = await post.likes.indexOf(currUserId);
            post.likes.splice(index,1);
            await post.save()
        })
         
        // console.log('coming till this');
        // delete User 
        await currUser.deleteOne();

        res.clearCookie('jwt',{
            httpOnly : true,
            secure : true
        });
    
        return res.send(success(200, "user is deleted "))

    } catch (e) {
        console.log(e);
        return res.send(error(500,e.message))
    }

    
 }

 const getMyInfo =  async(req,res)=>{
  
    try { 
       const user  = await User.findById(req._id);
       return res.send(success(200,{user}))
    } catch (e) {
        return res.send(error(500,e.message))
    }
    

 }


 const updateUserProfile = async(req,res)=>{
    try {
        //  console.log("api called");
        const {name,bio,userImg} = req.body;

        const user = await User.findById(req._id)

        if(name){
            user.name = name;
        }
        if(bio){
            user.bio = bio;
        }
        if(userImg){
           const cloudImg = await cloudinary.uploader.upload(userImg,{
            folder : "profileImg"
           })
            // console.log(cloudImg);
           user.avatar = {
              url : cloudImg.secure_url,
              publicId: cloudImg.public_id
           }
           console.log(user.avatar);

        }

         await user.save();
        // console.log('response',response);
        return res.send(success(200,{user}))
    } catch (e) {
        console.log(error(500,e.message));
    }
 }


const getUserProfile = async(req,res)=>{
  try {

    const userId= req.body.userId;
  
    const user  = await User.findById(userId).populate({
        path:'posts',
        populate:{
            path:'owner'
        }
    })
   
    const fullPost= user.posts;
 
    const posts = fullPost.map((item)=> mapPostOutput(item,req._id)).reverse();
  
    return res.send(success(200,{...user._doc,posts}))
  } catch (e) {
    console.log(e);
    return res.send(error(500,e.message))
  }
}



module.exports = {
    FollowOrUnfollowUser,
    getPostOfFollowing,
    getMyPost,
    getUserPosts,
    deleteMyProfile,
    getMyInfo,
    updateUserProfile,
    getUserProfile
    
    
}
