const jwt = require("jsonwebtoken");

const SECRET = "Anushree";

const authmiddleware = {
  verifyToken: async (request, response, next) => {
    const token = request.headers.authorization;
    console.log("token:", token);
    if (!token) {
      return response.json({
        message: "authentication error token doesnot exixts",
      });
    }
    try {
      const chktoken = jwt.verify(token, SECRET);
      request.userId = chktoken.userId;
      next();
    } catch (error) {
      console.log("authentication error", error);
    }
  },
};
module.exports = authmiddleware;
