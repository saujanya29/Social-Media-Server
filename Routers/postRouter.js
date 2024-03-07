const Router = require("express").Router()
const postController = require('../Controllers/postController');
const requireUser = require('../Middlewares/requireUser')

//Require user middleware will check the token then 
Router.get('/all',requireUser,postController.getAllPostsController)
Router.post('/',requireUser,postController.createPostController)
Router.post('/like',requireUser,postController.LikeOrDislikePost)
Router.put('/',requireUser,postController.UpdatePostController)
Router.delete('/',requireUser,postController.deletePost)

module.exports =Router;