const jwt = require("jsonwebtoken");
const config = require("../utilis/config");
const SECRET = config.SECRET_CODE;

const authmiddleware = {
  verifyToken: (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response
        .status(401)
        .json({ message: "Authentication error: token does not exist" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer token" format
    if (!token) {
      return response
        .status(401)
        .json({ message: "Authentication error: malformed token" });
    }

    try {
      const chktoken = jwt.verify(token, SECRET);
      request.userId = chktoken.userId;
      next();
    } catch (error) {
      console.log("Authentication error", error);
      return response
        .status(401)
        .json({ message: "Authentication error: invalid token" });
    }
  },
};

module.exports = authmiddleware;
