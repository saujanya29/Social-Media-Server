const router = require("express").Router()
const UserController = require('../Controllers/userController')
const requireUser = require("../Middlewares/requireUser")
const RequireUser = require("../Middlewares/requireUser")


router.post('/follow',RequireUser,UserController.FollowOrUnfollowUser)
router.get('/getFeedData',RequireUser,UserController.getPostOfFollowing)
router.get('/getMyPost',RequireUser,UserController.getMyPost)
router.get('/getUserPost',RequireUser,UserController.getUserPosts)
router.get('/getMyInfo',RequireUser,UserController.getMyInfo)
router.put('/',requireUser,UserController.updateUserProfile)
router.delete('/',RequireUser,UserController.deleteMyProfile)
router.post('/getUserProfile',RequireUser,UserController.getUserProfile)



module.exports = router;