const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function auth(req, res, next) {

  // grab the token from the header of the request
  const token = req.header("x-auth-token"); 
  
  // If user doesn't have a token in their request
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  // Takes the provided jsonwebtoken and returns the decoded payload.
  // If the token is not valid or has been tampared with it will throw an exception.

  try {
  // Verify the webtoken in with our PrivateKey.
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;

  // Pass the process to the next middleware in the Request processing pipeline which in this case, is the routes
    next();         

  } catch (ex) {
    
  // If jwt.verify() throws an exception
  // Invalid token bad request
    res.status(400).send(" Invalid token.");
  }
}
