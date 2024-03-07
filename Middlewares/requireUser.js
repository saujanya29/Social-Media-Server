// this middleware is used to check that user has access token or not
const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseWrapper');

module.exports = async (req, res, next) => {
  console.log("request in require user",req.headers.authorization);
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    // return res.status(401).send("authorization headers are required");
    return res.send(error(401,"authorization headers are required"))
  }

  // This is split the bearer and access key and access key will be splited at index 1 of array
  const accessToken = req.headers.authorization.split(" ")[1];

  // now we will verify the access token and our private key 
  // as when we made the access key we made it using private key and data so now while verifying it private key will be used 
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    //passing the user id into controllers
    console.log("Decoded",decoded);
    console.log("Decoded id",decoded._id);
    req._id = decoded._id;
    next();
  } catch (e) {
    console.log(e);
    // return res.status(401).send("Invalid access key")
    return res.send(error(401,"Invalid access key"))
  }
};
