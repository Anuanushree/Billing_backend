const jwt = require("jsonwebtoken");
const config = require("../utilis/config");
const SECRET = config.SECRET_CODE;

const authmiddleware = {
  verifyToken: (request, response, next) => {
    const token = request.headers.authorization;
    // console.log(token);
    if (!token) {
      return response.status(404).json({ error: "authentication error" });
    }
    try {
      const chktoken = jwt.verify(token, SECRET);
      request.userId = chktoken.userId;
      next();
    } catch (error) {
      console.log("authentication error", error);
      response.status(404).json({ error: "authentication error" });
    }
  },
};
module.exports = authmiddleware;
