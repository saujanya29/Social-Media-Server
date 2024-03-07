const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email:{
        type : String,
        unique: true,
        required:true,
        lowercase:true
    },
    password :{
         type : String,
         required:true,
         select: false // here if we select false then when we find the user in the database it will not show the password so thus it can be hide
    },
    name : {
        type : String,
        required:true,
    },
    bio: {
        type: String,
    },
    avatar : {
        publicId : String,
        url :String
    },
    followers :[{
        type:mongoose.Schema.Types.ObjectId,
        ref : "user"
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
    posts:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'post' // this refrence is used to link different schema so here ref will store all the post ids
    }
]
},{
    timestamps : true
})

// module.exports = mongoose.model('user',userSchema);
module.exports =mongoose.model('user',userSchema);