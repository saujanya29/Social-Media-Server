const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");




const signupController = async (req, res) => {
  try {
    
    const { name,email, password } = req.body;


    if (!email || !password || !name) {
      //   return res.status(400).send("all field are required");
      return res.send(error(400, "all field are required"));
    }
    
    const oldUser = await User.findOne({ email });
    
    if (oldUser) {
      //   return res.status(409).send("User is already registered");
      return res.send(error(409, "User is already registered"));
    }
   
    // hashing the body password
    const hashedPassword = await bcrypt.hash(password, 10);
    // creating user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
   
    //return response of user 
    //here if we send the user here in response then it will also show password as we are sending created user
    //we can hide pswd using select:false in users password schema
    return res.send(
      success(201, "user is created")
    );
  } catch (error) {
    console.log(error);
  }
};


const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "all field are required"));
    }
    // finding user in database
    const user = await User.findOne({ email }).select('+password'); 
    // here select +password is used as we have marked password selected false so by this it will be visible so the comparison can be done 

    if (!user) {
      return res.send(error(404, "User is not registered"));
    }
    //checking the password by comaring the encrypted password and req.body passwordd
    // as user wont show password so we need to include password field in the user
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.send(error(403, "Incorrect Password"));
    }

    //Generate access token and refresh token
    const accessToken = generateAccessToken({
      _id: user._id, // sending the data of _id
    });

    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    // Storing the refresh token in cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { accessToken }));
  } catch (e) {
    
  }
};



// this api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  // access cookies
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies.jwt) {
      return res.send(error(401, "Refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;
  console.log("refresh", refreshToken);
  try {
    //verifying the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    // Storing the _id and generating new access token
    const _id = decoded._id;
    console.log('decoded id in refresh',decoded._id);
    const accessToken = generateAccessToken({ _id });

    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
   
    return res.send(error(401, "Invalid access key"));
  }
};


const logoutController = async(req,res)=>{
  try {
    
     res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
    })

    return res.send(success(200,"User LoggedOut Succefully"))
  } catch (e) {
    return res.send(error(500,e.message))
  }
}



// internal function : this will generate the access token and below is the code
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1m",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

//Generate refresh token
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginController,
  signupController,
  refreshAccessTokenController,
  generateAccessToken,
  generateRefreshToken,
  logoutController
};
